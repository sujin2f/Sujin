/** app/items/rest/interface/post */

import { IRestItem } from 'app/items/rest/interface';
import { Post } from 'app/items/rest/schema/post';

export interface IPost extends Post, IRestItem {}
