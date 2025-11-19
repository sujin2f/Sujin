# syntax=docker.io/docker/dockerfile:1

FROM node:24

WORKDIR /

WORKDIR /app
COPY . .

RUN yarn install
RUN yarn run build

EXPOSE 80
ENV PORT=80
CMD ["yarn", "start"]
