# Sujin — Personal Portfolio Microservices

**Sujin** is a personal portfolio site for https://sujin.com built as a small microservice ecosystem. The stack includes:

-   **Next.js** — Frontend (React, SSR/SSG)
-   **Apollo Server** — API layer
-   **WordPress** — CMS for posts/pages
-   **MongoDB** — Serving WP/MySQL posts and additional data store

This repository contains multiple packages/services (Next app, GraphQL server, shared libs) and tooling to run them locally or in containerized environments.

**Quick Goals**

-   Serve content with Next.js (frontend)
-   Provide a GraphQL API via Apollo to combine WordPress and MongoDB data
-   Use WordPress as CMS and MongoDB for non-relational data
-   Next step: Add a dedicated Authentication service (Node.js)

**Table of Contents**

-   **Overview**: Architecture and how pieces interact
-   **Local Setup**: Install & run instructions
-   **Databases**: MySQL (WordPress) and MongoDB setup notes
-   **Environment**: Key env vars and where to configure them
-   **Next Steps**: Plan for Authentication server
-   **Security notes** and **License**

**Overview**

-   The Next.js app is the public frontend that consumes the GraphQL API.
-   The Apollo server aggregates data from WordPress (MySQL) and MongoDB and exposes a GraphQL schema for the frontend.
-   WordPress is used for content management (posts, pages, media). It runs with a MySQL backend.
-   MongoDB is used for specific app data and caching

**Local Setup**

1. Clone the repository

```bash
git clone https://github.com/sujin2f/Sujin.git
cd Sujin
```

2. Install dependencies (root or per-package depending on workspace tooling)

```bash
# husky
yarn install
# or
# pnpm install
# yarn install

# Install dependencies for each services
yarn install-modules
```

3. Environment variables

Create `.env` files per service or set environment variables in your shell.

Example (@graphql `.env` snippet):

```bash
MONGO=localhost:27017
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=password
MYSQL_DATABASE=wordpress
GRAPHQL_PORT=4000
```

4. Start databases (docker)

You can run MySQL and MongoDB via Docker.

```bash
# from repo root or package dir containing docker-compose.yml
cd @graphql && docker-compose -f docker-compose.dev.yml up -d  --remove-orphans
```

**Run services (examples)**

-   Start Next.js (development):

```bash
# from @next package or repo root depending on scripts
cd @next && yarn dev
```

-   Start Apollo GraphQL server (development):

```bash
cd @graphql && yarn dev
```

-   Build for production:

```bash
# Build Docker and start production server
cd @graphql && yarn package
```

**Databases**

-   WordPress uses MySQL — follow standard WP installation (import theme, plugins if applicable).
-   MongoDB stores serving documents like published posts.

**Next Steps — Authentication Server (Node.js)**

Planned: implement a dedicated Auth microservice that provides:

-   User authentication and session management
-   Token (JWT) issuance and refresh
-   OAuth connectors (Google)
-   GraphQL-compatible auth layer (or REST endpoints consumed by Apollo)

Recommendation & checklist:

-   Stack: Node.js + Express for Apollo Server + auth resolvers
-   Token strategy: JWT (short-lived access tokens + refresh tokens) or session cookies (HTTP-only)
-   Storage: Users can be stored in MongoDB
-   Libraries: `passport`/`passport-jwt`, `jsonwebtoken`, `express-session` (if cookie sessions), `oauth` libs if adding social login
-   GraphQL: integrate with Apollo via a token validation middleware that injects `user` into `context`

**Security notes**

-   Use HTTPS in production
-   Secure refresh tokens (store server-side or use httpOnly cookies)
-   Implement token revocation/blacklisting if necessary

**License**

-   This is a personal project — include your preferred license here (e.g., MIT) or keep proprietary notes.
