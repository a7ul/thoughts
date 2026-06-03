---
title: An alternative approach to building a simple API Rate limiter using NodeJS and Redis
date: 2019-01-15
originalUrl: https://blog.atulr.com/rate-limiter
description: An alternative Redis-based approach to API rate limiting that avoids common algorithms and uses atomic transactions for correctness.
---

Recently I came across an interesting problem of building an API rate limiter. While doing a bit of research on the same, I came across various algorithms and approaches. Some of the popular algorithms used to implement rate limiting are:

- Token bucket
- Leaky bucket
- Fixed window counter
- Sliding window log
- Sliding window counter

**This post is NOT about these algorithms.** I will try and explain an *alternative* approach here which makes use of certain Redis specific features.

## Design/Algorithm

High level system setup:

![High level system setup](https://blog.atulr.com/static/06207e9db428f01238d7bd5c1c1e5d55/4d4a2/high_level.png)

Lets say we have some way of uniquely identifying the source of each request. This can be the ip address, API key, user token or even user name.

For this example lets assume this unique identifier is a user token and we want to set a rate limit of 20 requests per min for the user. Now for each user we maintain one key in our redis store.

Basic idea is whenever we receive a request:

- We extract the **unique id (user_token)** that helps us identify the user. Lets say `user_token="abcdefghijklmno"`

- Start a **transaction** to our redis store.

- **Set a redis key** with value 0 if it doesnt exist already and **expiry as 60sec**

```
SET abcdefghijklmno 0 EX 60 NX
```

This will allow us to set the key to 0 if it doesnt exist and auto expire/clean the key after 60 secs. Note this doesnt alter the key if it already exists.

- **Increment the value** of the key

```
INCR abcdefghijklmno
```

- **Execute the transaction**. By doing these two operations in a transaction we do this atomically and hence are safe from race conditions.

- In the result of the transaction we will get the current value of `abcdefghijklmno` which is the total requests made by the user within 60sec. If this value is greater than the threshold (in our case 20) we reject the request.

### TLDR;

Redis commands:

```
> MULTI
OK
> SET <user_token> 0 EX 60 NX
QUEUED
> INCR <user_token>
QUEUED
> EXEC
1) OK
2) (integer) 1
```

If the value of the integer in the last result is greater than 20 we reject the request.

## Show me some code

Lets take the case of a simple express server:

```javascript
const app = express()
app.post('/login', loginHandler)
app.get('/ping', pingHandler)
app.get('/api-1', api1Handler)
app.post('/api-2', api2Handler)
app.get('/api-3', api3Handler)
```

To rate limit `/api-1`, `/api-2` and `/api-3` to 20 requests per min, create an express middleware: **rateLimiter.js**

```javascript
const rateLimiter = (req, res, next) => {
  return next()
}

module.exports = { rateLimiter }
```

And add it before the endpoints to be rate limited:

```javascript
const { rateLimiter } = require('./rateLimiter')

const app = express()
app.post('/login', loginHandler)
app.get('/ping', pingHandler)
app.use(rateLimiter) // middleware to limit requests to api-1, api-2, api-3
app.get('/api-1', api1Handler)
app.post('/api-2', api2Handler)
app.get('/api-3', api3Handler)
```

Now modify **rateLimiter.js** with the actual logic:

```javascript
const redis = require('redis')

const client = redis.createClient(process.env.REDIS_URL)

client.on('error', err => console.log(`Error ${err}`))

const rateLimiter = (req, res, next) => {
  const token = req.user.token // unique identifier - can be ip, API_KEY, etc
  client
    .multi() // start a transaction
    .set([token, 0, 'EX', 60, 'NX']) // SET UUID 0 EX 60 NX
    .incr(token) // INCR UUID
    .exec((err, replies) => {
      if (err) {
        return res.status(500).send(err.message)
      }
      const reqCount = replies[1]
      if (reqCount > 20) {
        return res
          .status(403)
          .send(`Quota of ${20} per ${60}sec exceeded`)
      }
      return next()
    })
}

module.exports = { rateLimiter }
```

In ~20 lines of code we have our very own simple and performant rate limiter.

## References

- [https://medium.com/@saisandeepmopuri/system-design-rate-limiter-and-data-modelling-9304b0d18250](https://medium.com/@saisandeepmopuri/system-design-rate-limiter-and-data-modelling-9304b0d18250)
- [https://en.wikipedia.org/wiki/Rate_limiting](https://en.wikipedia.org/wiki/Rate_limiting)
- [https://redis.io/commands](https://redis.io/commands)
