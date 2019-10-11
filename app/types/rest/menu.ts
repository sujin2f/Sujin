/// <reference path="base.d.ts" />
import { IRestItem, IRestItemBuilder } from 'RestBase';
import RestController from "./base";

export class MenuItem implements IRestItem {
  ID: number;
  children: Array<MenuItem>;
  classes: Array<string>;
  target: string;
  title: string;
  url: string;

  constructor(data: any) {
    this.ID = data.ID;
    this.children = data.children;
    this.classes = data.classes;
    this.target = data.target;
    this.title = data.title;
    this.url = data.url;
  }

  static create(data: any): MenuItem {
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
