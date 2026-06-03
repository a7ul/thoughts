---
title: Simplified guide to using Docker for local development environment
date: 2019-05-28
description: How to use Docker and docker-compose to set up a productive local development environment across multiple services written in different languages.
---

I recently started working at [Anyfin](https://anyfin.com/en). As a new engineer on the team, I had to setup the entire development environment. Drawing my expectations from my previous work engagements I thought this would take me a couple of days. But to my surprise I had a working setup of quite a few backend services written in NodeJS, Golang and Python along side the web site and portal (Javascript) in ~5hrs. This post will explain on how we use Docker at Anyfin to setup a productive local development environment quite easily.

**Credit:** The entire credit for the setup goes to my colleagues at Anyfin.

## Example Architecture

Lets say we have a set of services that have the following architecture:

- **NJS1** - NodeJS service running on port **7000**, dependent on Db1 (port **5433**)
- **Py1** - Python service running on port **9000**, dependent on Db1 (port **5433**)
- **Go1** - Golang service running on port **5000**, dependent on Db1 (port **5433**)
- **NJS2** - NodeJS service running on port **8000**, dependent on Db2 (port **5432**)
- **Web** - webpack dev server for frontend running on port **8080**

The code for these services: [https://github.com/a7ul/blog-docker-dev-environment-example](https://github.com/a7ul/blog-docker-dev-environment-example)

![Example architecture](https://blog.atulr.com/f069ee90ad81928b31443a2451837f10/architecture.svg)

## Issues with a typical setup

1. **Terminal hell:** To run all of those services, we would need to open up multiple terminal tabs/windows and then run them separately. This becomes harder to manage as the number of services grow.

2. **Incompatible dependencies**: If our services depend on different node versions, we need to manually switch node versions before running each one. Similarly, multiple database servers need to be running on different ports — all manual and cumbersome.

3. **Fresh setup**: Setting up all services on a new machine requires tracking all dependencies and their versions. This leads to the popular "Works on my machine" problem.

## Docker based local development environment

> "Docker is a tool designed to make it easier to create, deploy, and run applications by using containers."

Containers allow a developer to package up an application with all of the parts it needs, such as libraries and other dependencies, and ship it all out as one package.

### Mental model

#### Docker container

For the time being, consider a **Docker Container** as an extremely lightweight isolated Linux-based virtual machine inside which we will run our application service. The container will contain our code and all of its dependencies. We use one docker container per service and separate docker containers for our databases.

![Containers mental model](https://blog.atulr.com/413c6e75962d7baf8224cf72b52dac28/containers_mental_modal.svg)

#### Docker-Compose

> "Docker compose is a tool for defining and running multi-container Docker applications."

With Compose, you use a YAML file to configure your application's services. Then, with a single command, you create and start all the services from your configuration.

Docker compose contains:

- **Services**: Individual docker containers with their ports and configurations
- **Networks**: Allows different services to communicate with each other
- **Volumes**: Persistent storage for containers (think permanent hard drives)

![Docker Compose mental model](https://blog.atulr.com/5c736f83bee4417992e76fd0dcf5e271/compose_mental_modal.svg)

## Setting it up

Clone the example repo:

```bash
git clone https://github.com/a7ul/blog-docker-dev-environment-example.git
cd blog-docker-dev-environment-example
git checkout tags/basic-setup
git checkout -b tryingout
```

Project structure:

```
.
├── go1
│   ├── README.md
│   └── main.go
├── njs1
│   ├── README.md
│   ├── index.js
│   ├── package-lock.json
│   └── package.json
├── njs2
│   ├── README.md
│   ├── index.js
│   ├── package-lock.json
│   └── package.json
└── py1
    ├── README.md
    ├── requirements.txt
    └── server
        ├── __init__.py
        └── __main__.py
```

### Enter docker

Make sure you have docker running: [https://www.docker.com/get-started](https://www.docker.com/get-started)

First create a Dockerfile for njs1: **blog-docker-dev-environment-example/njs1/Dockerfile**

```dockerfile
FROM node:6.17.0

WORKDIR /root
ADD . /root
```

Now create **blog-docker-dev-environment-example/docker-compose.yml**:

```yaml
version: '3'
services:
  njs1:
    build: ./njs1
    command: sh -c "npm install && npm start"
    environment:
      - NODE_ENV=development
      - PORT=7000
    ports:
      - '7000:7000'
    working_dir: /root/njs1
```

In the folder containing **docker-compose.yml** run:

```bash
docker-compose up
```

If all goes well you should see it building the container and in the end:

```
NJS1 app listening on port 7000!
```

Open `http://localhost:7000` to test it out.

**docker-compose fields in detail:**

- `build:` — Path to the Dockerfile folder (or the Dockerfile itself)
- `command:` — Command to run when the container starts
- `environment:` — Environment variables to set
- `ports:` — Mapping of container port to host port
- `working_dir:` — Path inside the container to run the command from

### Making it efficient for development

Right now you can't edit source code without rebuilding the container. To fix this, we use **volumes** to mount our local source directly into the container.

Modify **njs1/Dockerfile** to not copy project files:

```dockerfile
FROM node:6.17.0

# WORKDIR /root   <-- comment out
# ADD . /root     <-- these two lines
```

Then tell docker-compose to mount the local directory:

```yaml
version: '3'
services:
  njs1:
    build: ./njs1
    command: sh -c "npm install && npm start"
    environment:
      - NODE_ENV=development
      - PORT=7000
    ports:
      - '7000:7000'
    working_dir: /root/njs1
    volumes:
      - ./njs1:/root/njs1:cached
```

Now add nodemon for auto-reload:

```bash
cd njs1
npm install --save-dev nodemon
```

Update `package.json` scripts:

```json
"scripts": {
  "start": "nodemon index.js"
}
```

Rebuild and run:

```bash
docker-compose up --build
```

The `--build` flag tells docker-compose to rebuild the images. Now you can edit `njs1/index.js` and nodemon will auto-reload inside the container.

![It works!](https://blog.atulr.com/63b09e0c3873a09e618abf0daf1c5e26/works_meme.gif)

### Finishing things up

After adding all services, the full `docker-compose.yml` looks like:

```yaml
version: '3'

services:
  njs1:
    build: ./njs1
    command: sh -c "npm install && npm start"
    environment:
      - NODE_ENV=development
      - PORT=7000
    ports:
      - '7000:7000'
    working_dir: /root/njs1
    volumes:
      - ./njs1:/root/njs1:cached

  njs2:
    image: node:12.3-alpine
    command: sh -c "npm install && npm start"
    environment:
      - NODE_ENV=development
      - PORT=8000
    ports:
      - '8000:8000'
    working_dir: /root/njs2
    volumes:
      - ./njs2:/root/njs2:cached

  py1:
    image: python:3-stretch
    command: sh -c "pip install -r requirements.txt && python -m server"
    environment:
      - PORT=9000
      - FLASK_ENV=development
    ports:
      - '9000:9000'
    working_dir: /root/py1
    volumes:
      - ./py1:/root/py1:cached

  go1:
    image: golang:1.12-alpine
    command: sh -c "go run ."
    environment:
      - PORT=5000
    ports:
      - '5000:5000'
    working_dir: /root/go1
    volumes:
      - ./go1:/root/go1:cached
```

Note: For simple setups you can use the `image:` property to reference a docker-hub image directly instead of writing your own Dockerfile.

Full docker-compose reference: [https://docs.docker.com/compose/compose-file/](https://docs.docker.com/compose/compose-file/)

## Commands Cheatsheet

**Start all services** (detached):

```bash
docker-compose start
```

**Stop all services:**

```bash
docker-compose stop
```

**Launch a specific service:**

```bash
docker-compose up njs1
```

**Restart a single service:**

```bash
docker-compose restart njs1
```

**Logs from a specific service:**

```bash
docker-compose logs -f njs1
```

**SSH into a particular service container:**

```bash
docker-compose exec njs1 bash
```

## Tips for a smoother workflow

### Services running too slow?

You might notice services launching very slowly. This is often because Docker is allocated too little CPU/RAM.

Go to: `Docker icon → Preferences → Advanced`

Change the slider to give CPU > 3 cores and RAM > 6GB.

### Low on space / want to start fresh?

Remove all docker containers:

```bash
docker rm $(docker ps -a -q) -f
```

Remove all docker images:

```bash
docker rmi $(docker images) -f
```

### Same Dockerfile for local development and production?

I wrote a follow up post all about this:

> [Use the same Dockerfile for both local development and production with multi-stage builds](/docker-local-production-image.html)
