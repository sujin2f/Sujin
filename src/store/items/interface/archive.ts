/** store/items/interface/archive */

import { IRestItem } from 'store/items/interface';
import { Archive } from 'store/items/schema/archive';

export interface IArchive extends Archive, IRestItem {}
