/** store/items/test-data/simple-post.spec */

import SimplePost from 'store/items/simple-post';
import { rawData as data } from 'store/items/test-data/post.spec';

const rawData = data.related[0];

export const response = new SimplePost(rawData);
