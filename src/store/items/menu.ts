/*
 * Menu Item
 * store/items/menu
 */

import { Menu as MenuType } from 'store/items/schema/menu';

export class Menu implements MenuType {
  /**
   * Unique ID of WP Post object
   */
  ID: number;
  /**
   * The title of the menu item.
   */
  title: string;
  /**
   * Link URL
   */
  url: string;
  /**
   * Link target HTML attribute
   */
  target: '_blank'|'_self';
  /**
   * Parent ID
   */
  parent?: number;
  /**
   * HTML class attributes
   */
  classes?: string[];
  /**
   * Child menu items
   */
  children?: MenuType[];

  constructor(data: any) {
    this.ID = data.ID;
    this.title = data.title;
    this.url = data.url;
    this.target = data.target;
    this.parent = data.parent;
    this.children = data.children.map((child: MenuType) => new Menu(child));
    this.classes = data.classes;
  }
}
