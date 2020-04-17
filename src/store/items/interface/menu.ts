/** store/items/interface/menu */

import { IRestItem } from 'store/items/interface';
import { Menu } from 'store/items/schema/menu';

export interface IMenu extends Menu, IRestItem {}
