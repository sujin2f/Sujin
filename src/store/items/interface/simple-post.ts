/** store/items/interface/simple-post */

import { IRestItem } from 'store/items/interface';
import { SimplePost } from 'store/items/schema/simple-post';

export interface ISimplePost extends SimplePost, IRestItem {}
