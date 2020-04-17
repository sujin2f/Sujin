/** store/items/interface/term */

import { IRestItem } from 'store/items/interface';
import { Term } from 'store/items/schema/term';

export interface ITerm extends Term, IRestItem {}
