/* eslint-disable max-classes-per-file */
import { IRestItem } from 'app/types/rest/base.d';
import RestController from 'app/types/rest/base';

export class MenuItem implements IRestItem {
  ID: number;
  children: Array<MenuItem>;
  classes: Array<string>;
  target: string;
  title: string;
  url: string;

  constructor(data) {
    this.ID = data.ID;
    this.children = data.children;
    this.classes = data.classes;
    this.target = data.target;
    this.title = data.title;
    this.url = data.url;
  }

  static create(data): MenuItem {
    return new MenuItem(data);
  }
}

/*
 * Menu Controller
 */
export default class MenuController extends RestController<MenuItem> {
  static instance: {
    [slug: string]: MenuController;
  } = {};

  /*
   * Get multiton object
   */
  static getInstance(slug: string): MenuController {
    if (!MenuController.instance[slug]) {
      MenuController.instance[slug] = new MenuController(MenuItem);
      MenuController.instance[slug].restUrl = `/wp-json/sujin/v1/menu/${slug}`;
    }
    return MenuController.instance[slug];
  }
}
/* eslint-enable max-classes-per-file */
