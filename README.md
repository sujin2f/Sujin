# Wordpress Theme Sujin

![](https://github.com/sujin2f/Sujin/workflows/Fire%20everything/badge.svg)

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
npm i

# Install composer
composer install

# Create Docker Image
cd ./.configs/docker/
docker build -f Dockerfile.dev -t sujin2f/wordpress:latest .

# Activate docker containers
cd ./.configs/docker/
docker-compose -f ./docker-compose.infrastructure.yml -f ./docker-compose.yml up -d

# Install json-schema-to-typescript globally
npm i -G json-schema-to-typescript
Create TS interfaces from schema
npm run schema:build
```

### NPM scripts
```shell
# Run NPM
npm start

# Run Jest
npm run test

# Run PHPCS
npm run phpcs

# Run PHP Unit
npm run phpunit

# Bundle Analyzer
npm run bundle-analyzer

# Build
npm run build

# Fire all checks
npm run arson
```

### Ignore settings file from your local change
If you want to change for your local environment like password, execute this on your terminal:
```shell
git update-index --skip-worktree ./.configs/docker/.env
```

### Install PHP x-debug
Code coverage feature needs to install `x-debug` locally. You may already have PHP 7.x in your local. Unfortunately, `brew` doesn't support `x-debug` installation anymore. You should use `pecl` instead. I followed [this instruction](https://javorszky.co.uk/2018/05/03/getting-xdebug-working-on-php-7-2-and-homebrew/). The version could be different on your local. I removed the symlink of `/usr/local/Cellar/php/7.3.1/pecl`, my PHP configuration is in `/usr/local/etc/php/7.3/conf.d/xdebug.ini`, and the `zend_extension` is `/usr/local/Cellar/php/7.3.1/pecl/20180731/xdebug.so`.
