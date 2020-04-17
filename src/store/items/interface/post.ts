/** store/items/interface/post */

import { IRestItem } from 'store/items/interface';
import { Post } from 'store/items/schema/post';

export interface IPost extends Post, IRestItem {}
