/** app/items/rest/interface/image */

import { IRestItem } from 'app/items/rest/interface';
import { Image } from 'app/items/rest/schema/image';

export interface IImage extends Image, IRestItem {}
