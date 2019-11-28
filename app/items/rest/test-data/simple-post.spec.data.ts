/** app/items/rest/test-data/simple-post.spec */

import SimplePost from 'app/items/rest/simple-post';
import { rawData as data } from 'app/items/rest/test-data/post.spec';

const rawData = data.related[0];

export const response = new SimplePost(rawData);
