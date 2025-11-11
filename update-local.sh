#!/bin/sh

( cd @lib ; yarn upgrade file:../@common/share ; yarn upgrade file:../@common/node-cache )
( cd @common/node-cache ; yarn upgrade file:../../@common/share )
( cd @common/mysql ; yarn upgrade file:../../@common/share )
( cd @graphql ; yarn upgrade file:../@common/share ; yarn upgrade file:../@common/node-cache ; yarn upgrade file:../@lib ; yarn upgrade file:../@common/mysql )
