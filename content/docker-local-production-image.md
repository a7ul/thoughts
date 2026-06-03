---
title: Use the same Dockerfile for both local development and production with multi-stage builds
date: 2021-07-28
originalUrl: https://blog.atulr.com/docker-local-production-image
description: How to use Docker multi-stage builds to eliminate the need for separate Dockerfiles for development and production.
---

This is a follow-up to my [earlier post](/docker-local-environment.html) on using Docker for local development. One problem we kept running into at Anyfin was maintaining two separate Dockerfiles  -  one for local development and one for production. Whenever we updated a dependency, we had to update both files, risking inconsistencies between environments.

Multi-stage builds solve this cleanly.

## The problem

The typical setup involved separate files:

```
api/
├── index.js
├── package.json
├── Dockerfile              ← production
└── Dockerfile.development  ← local dev
```

With a docker-compose for local development pointing at `Dockerfile.development` and CI pointing at `Dockerfile`. Two files to maintain, easy to drift out of sync.

## The solution: multi-stage builds

Multi-stage Dockerfiles let you define multiple images from a single file using the `target` parameter. The idea: put shared dependencies in a `base` stage, and layer production-only steps into a `prod` stage.

**Single Dockerfile:**

```dockerfile
FROM node:16-alpine as base

RUN apk add --update graphicsmagick

FROM base as prod

WORKDIR /home/node/app
COPY package.json yarn.lock ./
RUN yarn install --production
COPY . .

CMD ["node", "index.js"]
```

**docker-compose.yml for local development:**

```yaml
api:
  build:
    context: "./api"
    target: "base"
  command: sh -c "yarn install && yarn start"
  volumes:
    - ./api:/home/node/app:cached
```

**Production build:**

```bash
docker build . -t api:latest
```

### What changed

- Local development uses the `base` stage via the `target` parameter  -  gets the system dependencies, mounts source via volumes
- Production builds the full `prod` stage  -  copies and installs only production dependencies
- Single source of truth: bump Node version in one place and both environments update

### Key benefits

- No manual synchronization between Dockerfiles
- `docker-compose up api` works for local development
- `docker build . -t api:latest` builds the production image
- The base system (OS packages, global tools) is identical in both environments

This pattern has worked well for us across multiple services at Anyfin and has saved us from several "works locally but breaks in prod" incidents that were caused by environment drift.
