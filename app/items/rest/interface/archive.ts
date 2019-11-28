/** app/items/rest/interface/archive */

import { IRestItem } from 'app/items/rest/interface';
import { Archive } from 'app/items/rest/schema/archive';

export interface IArchive extends Archive, IRestItem {}
