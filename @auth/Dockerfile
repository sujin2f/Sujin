# syntax=docker.io/docker/dockerfile:1
# Build Stage
FROM node:25-alpine as base
FROM base AS deps

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn run build

# Production Stage
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.build ./.build
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./

EXPOSE 80
CMD ["yarn", "start"]
