#!/bin/sh

( yarn --cwd ./@common/share build )
( rm @common/node-cache/yarn.lock ; yarn --cwd ./@common/node-cache ; yarn --cwd ./@common/node-cache build )
( rm @lib/yarn.lock ; yarn --cwd ./@lib ; yarn --cwd ./@lib build )
( rm @graphql/yarn.lock ; yarn --cwd ./@graphql )
( rm @next/yarn.lock ; yarn --cwd ./@next )
