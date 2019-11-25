#!/bin/sh

cd schema/response

json2ts background.json > ../../app/items/rest/background.d.ts

json2ts flickr.json > ../../app/items/rest/flickr.d.ts

json2ts image.json > ../../app/items/rest/image.d.ts

json2ts menu.json > ../../app/items/rest/menu.d.ts

json2ts post.json > ../../app/items/rest/post.d.ts

json2ts simple-post.json > ../../app/items/rest/simple-post.d.ts

json2ts term.json > ../../app/items/rest/term.d.ts
