# Sujin GraphQL API

This repository contains the GraphQL API for sujinc.com. It exposes a GraphQL server that aggregates data from a WordPress MySQL database and from project MongoDB collections (posts, pages, archives, recipes, backgrounds, etc.) used by the site.

**Quick overview**

- Language: TypeScript
- Server entry: `src/server.ts`
- Main concerns: WordPress → MySQL reads, MongoDB documents, GraphQL resolvers
- Local packages: `@sujin/lib`, `@sujin/share` are referenced
  as file dependencies (see `package.json`).

**Prerequisites**

- Node.js (v18+ recommended)
- Yarn or npm
- MongoDB server accessible to the app
- MySQL (WordPress DB) accessible to the app

**Environment variables**
The app reads several environment variables. Create a `.env` file (not included in the repo) or provide them in your environment before running.

- MongoDB
    - `MONGO` — MongoDB host
    - `MONGO_PORT` — MongoDB port (default: `27018` for this project)
    - `MONGO_USER` — MongoDB user
    - `MONGO_PASSWORD` — MongoDB password
    - `MONGO_DATABASE` — MongoDB database name

- MySQL (WordPress)
    - `MYSQL` — MySQL host
    - `MYSQL_USER` — MySQL user
    - `MYSQL_PASSWORD` — MySQL password
    - `MYSQL_DB` — MySQL database name

- Secrets
    - `NEXTAUTH_SECRET` — Used by NextAuth integrations (if used)
    - `GQL_SECRET` — GraphQL JWT secret used by `verifyToken`/`verifyAdmin`
    - `EMAIL_SECRET` — Email-related secret (if used)

- Optional
    - `FLICKR_ID` — Flickr feed user ID used by the `flickr` resolver

Notes:

- The app intentionally validates some environment variables at module load
  (see `src/utils/mongo/connection.ts`) and will throw on missing critical
  values (e.g. Mongo connection vars).

**Install**
Use `yarn` or `npm` to install dependencies. The repository uses several local file dependencies; ensure the sibling packages (`@sujin/lib`, `@sujin/share`) are available at the paths referenced in `package.json` (relative `../` paths) or update `package.json` to point to published packages.

Using Yarn:

```bash
yarn install
```

Using npm:

```bash
npm install
```

**Scripts** (from `package.json`)

- `yarn dev` / `npm run dev` — run webpack in watch mode and run the built server with nodemon for development
- `yarn build` / `npm run build` — compile bundle with webpack for production
- `yarn start` / `npm run start` — start the compiled production bundle
- `yarn lint` / `npm run lint` — run ESLint on the `src` files

**Run (development)**

1. Ensure environment variables are set (create `.env` file)
2. Start dev environment:

```bash
# with yarn
yarn dev

# or with npm
npm run dev
```

The dev flow runs webpack in watch mode and restarts the built output with
`nodemon` when changes occur.

**Run (production)**

```bash
# build
yarn build
# start
yarn start
```

**Tests**
The project uses Jest with `ts-jest` for TypeScript tests. There is no `test` script defined in `package.json`, so run directly with `npx` or `yarn`:

```bash
# Run Jest directly
npx jest
# or
yarn jest
```

**Repository structure (important paths)**

- `src/` — TypeScript source
    - `server.ts` — GraphQL server bootstrap
    - `resolvers/` — GraphQL resolvers grouped by feature (wordpress, recipes, users, misc)
    - `schema/` — Mongoose schema fragments and models
    - `utils/` — helpers for MySQL, Mongo, security, and logging

**Next steps for versioning-up**

- Finish jest test

**Repository structure (important paths)**

- `src/` — TypeScript source
    - `server.ts` — GraphQL server bootstrap
    - `resolvers/` — GraphQL resolvers grouped by feature (wordpress, recipes,
      users, misc)
    - `schema/` — Mongoose schema fragments and models
    - `utils/` — helpers for MySQL, Mongo, security, and logging

**Setting up Postman (Local/Dev)**

1. First, create a long-lifetime token

```typescript
jwt.sign(
    {
        name: 'Sujin Choi',
        email: 'sujin.2f@gmail.com',
    },
    getSecret('next'),
    {
        expiresIn: '30Y',
    },
)
```

1. Create a new Postman GraphQL request at `http://localhost:4000` with a query:

```graphql
mutation Login {
    login {
        accessToken
    }
}
```

1. Add token to its Authorization, Bearer Token
1. Add the request's Scripts tab to register an access token

```javascript
pm.collectionVariables.set('accessToken', pm.response.data.login.accessToken)
```

1. In the new request's header, add `Bearer {{accessToken}}` to `Authorization` field
