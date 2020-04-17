/** store/items/interface/image */

import { IRestItem } from 'store/items/interface';
import { Image } from 'store/items/schema/image';

export interface IImage extends Image, IRestItem {}
