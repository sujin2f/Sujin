#!/bin/sh

( cd lib ; yarn upgrade file:../common )
( cd graphql ; yarn upgrade file:../common ; yarn upgrade file:../lib )
