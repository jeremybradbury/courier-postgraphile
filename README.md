# courier-postgraphile: Secure Messaging Courier w/ Integration Testing Framework

## Docker + PostgreSQL + GraphQL + PostGraphile + Jest + Faker = 😍

- https://docs.docker.com/compose/
- https://www.postgresql.org/docs/14/index.html
- https://www.apollographql.com/docs/tutorial/client/
- https://www.graphile.org/postgraphile/
- https://jestjs.io/
- https://github.com/jeremybradbury/faker.js

# Prerequisites

1. install docker
1. install docker-compose
1. install git
1. install node 16 (14 also works, not fully tested in 10 or 12)
1. install psql CLI client (server includes it)
1. clone repository: `git clone git@github.com:jeremybradbury/courier-postgraphile.git`

# Getting Started

1. dependencies: `npm i`
1. setup: `yarn setup` or `yarn setup_win` respectively
1. test: `yarn test` (concurrently runs `yarn start` & `yarn tests`)
1. build schema: `yarn build`
1. develop: `yarn dev`
1. "prod mode": `yarn prod` - TODO: improve this
1. ci testing: `yarn tests` (expects server is running on localhost:5000)

# Core concepts & tenets

This is a project, but also a simple base. Fork or even degit to private, just please, understand and respect the basics of [the MIT license](LICENSE.txt). Just leave it there without modification. It's a short read we often ignore.

We're in this together & we all become better because of each other's contributions!
## Naming Conventions

This is pretty simple, yet requires some explanation.

1. Jest looks in the `__tests__` folders look for files of the same name.
1. GraphQL filenames match their query names.
1. DeleteObject, CreateObject and GetObjectById are relied on by test helpers.

## Integration Testing over Unit Testing

Since integration tests are actually pretty simple to automate these days, they can prevent server code from being plagued with more complex patterns to support unit testing.

In this case, unit tests would have to be done in the database engine.

This framework focuses less on commit hooks preventing bad commits, and more CI based, pre-deployment testing that can be triggered locally with ease.

## Boilerplate Testing Framework

The best way to explain something is to just show you, look at the code, run the tests quickly on your local with a Docker & PostgreSQL running on port 5435 so it shouldn't conflict with any local services, making it zero-config even if you already run ports 5432/5433/5434.

Most of my test files are just over 100 lines, including `test_helpers.js` and the 2 most complex tests: `mutation/__tests__/CreateMessage.js` & `mutation/__tests__/CreateThread.js`.

The query tests are under 10 lines & `CreateSession` is just over 10 lines.

This project is rather simple with a narrow focus, but should be able to fork and refactor for other uses.

## Difference between Unit & Integration Testing

You're probably asking, why on earth are those 2 tests files over 100 lines?

First, we start with faker to generate realistic data, rather than complex mocks. Then we actually create a record, read the record, edit the record, read the record again, delete the record, and perhaps ensure it's gone.

This allows us to test the application exactly as users intend, in all of the proper ways & contexts: local, sandbox, staging & production.

So this is why `CreateThread` & `CreateMessage` are long, we perform realtime data mocks and cleanup after.

## Why JS, not TS? - My opinions often change with new info

This is a great question, to which I have a few great answers, that you may entirely disagree with. GraphQL has consistent server & client libraries in every language maintained by different humans. The opposite approach (decentralized support, over singular) as gRPC & protobuf, to accomplish the same things: stronger typing than JSON, but not as painful as XML.

1. GraphQL gives consistent controllable typings across client & server environments.
1. TypeScript rules in the client, but server side you only need types translated/enforced properly for the database engine.
1. PostGraphile solves things much different than Prisma or NestJS, types flow from PostgreSQL to GraphQL to Apollo Client & back.
1. I want to support Node 12, Postgres 9 & use fewer dependencies.
1. Simpler is better - few lines are needed for tests & types are handled transparently.

I def suggest TypeScript with Svelte/React/etc on the client, but until we can `TSON.serialize()` & `TSON.unserialize()` on both the client & server, TS fails us at interoperability & has lead to solutions (in combination with NoSQL engines) like Kafka, SQS, GraphQL & gRPC (to replace SOAP/RPC essentially).

## What else? - Final thoughts

Q: How do you even unit test a delete? 
A: Very carefully. 

For us it's much easier to use delete actions to cleanup our test data. You may notice we have such a long "Create" test. It also deletes & edits, so you won't find edit tests or delete tests. Our deletes are only threads objects, which will cascade to sessions & messages. 

Locally, we can wipe tables and ensure nothing is left behind and we handle bugs before push it a feature branch for sandbox deployment which likely has a collection of bad data that's either synced from prod, generated and/or wiped regularly.

I believe it's best to have an architecture that scales, while getting out of the way of the developers. Fast prototyping, production ready, without upper limits is the dream.

## What's missing? - TODOs, goals, considerations & ideas

- **Add subscriptions to threads**.
- The callback nature of some helpers isn't ideal but we keep it limited to one.
- More Linux / Mac testing / testers - I work from windows for gaming reasons.
- Perhaps repeating the previous line, more prod testing.
- Client work... I only have clients in progress for Redis
- A cleaner repo, sans examples, up/down stream from this repo?
- Remove the (officially deprecated) `postgraphilerc.js` approach and use a middleware approach instead.

## Special thanks - OSS Legends & heroes all
- https://github.com/benjie
- https://github.com/NicolasCARPi
- https://github.com/postgres
- https://github.com/nodejs
- https://github.com/nginx
