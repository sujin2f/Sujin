import axios from 'axios';

// Constants
import { STORE } from 'app/constants/common';

export class MenuItem {
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
}

/*
 * Menu Controller
 */
export default class MenuController {
  static instance: {
    [slug: string]: MenuController;
  } = {};
  readonly REST_URL = '/wp-json/sujin/v1/menu/';

  slug: string;
  entities: Array<MenuItem> = [];
  loading: boolean = false;
  failed: boolean = false;
  init: boolean = false;

  /*
   * Get multiton object
   */
  static getInstance(slug: string): MenuController {
    if (!MenuController.instance[slug]) {
      MenuController.instance[slug] = new MenuController();
      MenuController.instance[slug].slug = slug;
    }
    return MenuController.instance[slug];
  }

  /*
   * REST request
   */
  public request(component: any): void {
    this.init = true;
    this.loading = true;
    this.failed = false;
    component.forceUpdate();

    axios.get(`${this.REST_URL}${this.slug}`)
      .then((response) => {
        if (response.status === 204) {
          this.loading = false;
          this.failed = true;
          return;
        }

        this.entities = [];
        this.entities = response.data.map((item) => new MenuItem(item));
        this.loading = false;
        this.failed = false;
      }).catch(() => {
        this.loading = false;
        this.failed = true;
      }).finally(() => {
        component.forceUpdate();
      });
  }
}
