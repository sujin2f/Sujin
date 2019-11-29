/** app/items/rest/interface/simple-post */

import { IRestItem } from 'app/items/rest/interface';
import { SimplePost } from 'app/items/rest/schema/simple-post';

export interface ISimplePost extends SimplePost, IRestItem {}
