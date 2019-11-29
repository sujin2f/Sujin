/** app/items/rest/menu */

import { IMenu } from 'app/items/rest/interface/menu';

export default class Menu implements IMenu {
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
  target: '_blank' | '_self';
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
  children?: IMenu[];

  constructor(data) {
    this.ID = data.ID;
    this.title = data.title;
    this.url = data.url;
    this.target = data.target;
    this.parent = data.parent;
    this.children = data.children.map((child) => new Menu(child));
    this.classes = data.classes;
  }

  static create(data): IMenu {
    return new Menu(data);
  }
}
