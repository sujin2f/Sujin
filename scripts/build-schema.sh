#!/bin/sh

cd schema/response

json2ts -i archive.json -o ../../app/items/rest/archive.d.ts --style.singleQuote

json2ts -i background.json -o ../../app/items/rest/background.d.ts --style.singleQuote

json2ts -i flickr.json -o ../../app/items/rest/flickr.d.ts --style.singleQuote

json2ts -i image.json -o ../../app/items/rest/image.d.ts --style.singleQuote

json2ts -i menu.json -o ../../app/items/rest/menu.d.ts --style.singleQuote

json2ts -i post.json -o ../../app/items/rest/post.d.ts --style.singleQuote

json2ts -i simple-post.json -o ../../app/items/rest/simple-post.d.ts --style.singleQuote

json2ts -i term.json -o ../../app/items/rest/term.d.ts --style.singleQuote
