/** app/items/rest/interface/term */

import { IRestItem } from 'app/items/rest/interface';
import { Term } from 'app/items/rest/schema/term';

export interface ITerm extends Term, IRestItem {}
