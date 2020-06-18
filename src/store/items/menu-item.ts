/*
 * Menu Item
 * store/items/menu-item
 */

import { MenuItem as MenuItemType } from 'store/items/schema/menu-item';

export class MenuItem implements MenuItemType {
  /**
   * Unique ID of WP Post object
   */
  ID: number
  /**
   * The title of the menu item.
   */
  title: string
  /**
   * Link URL
   */
  url: string
  /**
   * Link target HTML attribute
   */
  target: '_blank' | '_self'
  /**
   * Parent ID
   */
  parent: number
  /**
   * HTML class attributes
   */
  classes: string[]
  /**
   * Child menu items
   */
  children: MenuItem[]

  constructor(data: any) {
    this.ID = data.ID;
    this.title = data.title;
    this.url = data.url;
    this.target = data.target;
    this.parent = data.parent;
    this.children = data.children.map((child: MenuItemType) => new MenuItem(child));
    this.classes = data.classes;
  }
}
