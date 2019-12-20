/** app/items/rest/interface/flickr */

import { IRestItem } from 'app/items/rest/interface';
import { Flickr } from 'app/items/rest/schema/flickr';

export interface IFlickr extends Flickr, IRestItem {}
