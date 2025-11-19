#!/bin/sh

( rm @common/yarn.lock ; yarn --cwd ./@common ; yarn --cwd ./@common build )
( rm @lib/yarn.lock ; yarn --cwd ./@lib ; yarn --cwd ./@lib build )
( rm @graphql/yarn.lock ; yarn --cwd ./@graphql )
( rm @next/yarn.lock ; yarn --cwd ./@next )
