/// <reference path="../../types/rest/menu.d.ts" />

import axios from 'axios';

// Constants
import { STORE } from 'app/constants/common';

import * as MenuTypes from 'Menu';
import RestObject from './abs-rest';

class FlickrItem {
  title: string;
  link: string;
  media: {
    origin: string;
    s: string;
    t: string;
    b: string;
    m: string;
  };

  constructor(data: any) {
    this.title = data.title;
    this.link = data.link;
    this.media = data.media;
  }
}

/*
 * Flickr Controller
 */
export default class FlickrController {
  static instance: FlickrController;
  readonly REST_URL = '/wp-json/sujin/v1/flickr/';

  entities: Array<FlickrItem> = [];
  loading: boolean = false;
  failed: boolean = false;
  init: boolean = false;

  /*
   * Get singleton object
   */
  static getInstance(): FlickrController {
    if (!FlickrController.instance) {
      FlickrController.instance = new FlickrController();
    }
    return FlickrController.instance;
  }

  /*
   * REST request
   */
  public request(component: any): void {
    this.init = true;
    this.loading = true;
    this.failed = false;
    component.forceUpdate();

    axios.get(this.REST_URL)
      .then((response) => {
        if (response.status === 204) {
          this.loading = false;
          this.failed = true;
          return;
        }

        this.entities = [];
        this.entities = response.data.map((item) => new FlickrItem(item));
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

class Test extends RestObject<FlickrItem> {}
class Test2 extends RestObject<MenuTypes.MenuItem> {}

console.log(Test.getInstance(Test, FlickrItem));
