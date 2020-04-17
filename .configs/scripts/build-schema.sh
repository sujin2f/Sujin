#!/bin/sh

cd schema/response

json2ts -i archive.json     -o ../../app/items/rest/schema/archive.ts     --style.singleQuote
json2ts -i background.json  -o ../../app/items/rest/schema/background.ts  --style.singleQuote
json2ts -i flickr.json      -o ../../app/items/rest/schema/flickr.ts      --style.singleQuote
json2ts -i image.json       -o ../../app/items/rest/schema/image.ts       --style.singleQuote
json2ts -i menu.json        -o ../../app/items/rest/schema/menu.ts        --style.singleQuote
json2ts -i post.json        -o ../../app/items/rest/schema/post.ts        --style.singleQuote
json2ts -i simple-post.json -o ../../app/items/rest/schema/simple-post.ts --style.singleQuote
json2ts -i term.json        -o ../../app/items/rest/schema/term.ts        --style.singleQuote
