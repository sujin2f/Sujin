# Wordpress Theme Sujin

[![Build Status](https://travis-ci.org/sujin2f/Sujin.svg)](https://travis-ci.org/sujin2f/Sujin)
[![Coverage Status](https://coveralls.io/repos/github/sujin2f/Sujin/badge.svg?branch=master)](https://coveralls.io/github/sujin2f/Sujin?branch=master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/8f1604bf6483486697ea70b7650df0e4)](https://www.codacy.com/manual/sujin.byun/Sujin?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=sujin2f/Sujin&amp;utm_campaign=Badge_Grade)

The Wordpress Theme which frontend is React from the new WP Editor Gutenberg.

## Tech Stack
1. Language: ES6, Typescript, SASS
2. Library: React (from WP)
3. Bundler: Webpack, Babel
4. Lint: ESLint, TSLint, PHPCS - WPCS
5. Test: Jest, PHP Unit

## Dev Note
To install this theme in dev mode:

```shell
# Install NPM packages
$ npm i

# Install composer
$ composer install

# Create Docker Image
$ cd ./.configs/docker/
$ docker build -f Dockerfile.dev -t sujin2f/wordpress:latest .

# Activate docker containers
$ cd ./.configs/docker/
$ docker-compose -f ./docker-compose.infrastructure.yml -f ./docker-compose.yml up -d
```

### NPM scripts
```shell
# Run NPM
$ npm start

# Run Jest
$ npm run test

# Run PHPCS
$ npm run phpcs

# Run PHP Unit
$ npm run phpunit

# Bundle Analyzer
$ npm run bundle-analyzer

# Build
$ npm run build

# Fire all checks
$ npm run arson
```
