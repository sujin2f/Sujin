# syntax=docker.io/docker/dockerfile:1
FROM node:24

WORKDIR /app
COPY . .

RUN yarn install
RUN yarn run build

EXPOSE 3000
CMD ["yarn", "start"]
