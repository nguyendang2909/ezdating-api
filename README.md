vMessage - Chat application

## Description

A dating application using NestJS, Redis and MongoDB

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn dev

# staging mode
$ yarn build
$ yarn stag

# production mode
$ yarn build
$ yarn prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Create mkcert
# Setup mkcert tool
brew install mkcert (for MacOS)

mkcert -install

mkdir -p .cert

mkcert -key-file ./.cert/key.pem -cert-file ./.cert/cert.pem "localhost"

# Migration
npx knex migrate:make create_users_table

# Deploy
docker-compose --env-file ./.env.development -f deployment.development.yml up -d
yarn dev
