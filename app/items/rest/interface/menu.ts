/** app/items/rest/interface/menu */

import { IRestItem } from 'app/items/rest/interface';
import { Menu } from 'app/items/rest/schema/menu';

export interface IMenu extends Menu, IRestItem {}
