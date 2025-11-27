# syntax=docker.io/docker/dockerfile:1
FROM node:25-alpine

WORKDIR /app
COPY . .

RUN yarn install
RUN yarn run build

ARG SERVER_PORT
EXPOSE $SERVER_PORT
CMD ["yarn", "start"]
