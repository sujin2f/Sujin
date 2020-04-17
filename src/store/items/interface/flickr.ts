/** store/items/interface/flickr */

import { IRestItem } from 'store/items/interface';
import { Flickr } from 'store/items/schema/flickr';

export interface IFlickr extends Flickr, IRestItem {}
