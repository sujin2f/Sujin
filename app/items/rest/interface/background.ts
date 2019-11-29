/** app/items/rest/interface/background */

import { IRestItem } from 'app/items/rest/interface';
import { Background } from 'app/items/rest/schema/background';

export interface IBackground extends Background, IRestItem {}
