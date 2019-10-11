/// <reference path="base.d.ts" />

import { IRestItem, IRestItemBuilder } from 'RestBase';
import RestController from "./base";

export class FlickrItem implements IRestItem {
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

  static create(data: any): FlickrItem {
      return new FlickrItem(data);
  }
}

/*
 * Flickr Controller
 */
export default class FlickrController extends RestController<FlickrItem> {
  static instance: FlickrController;
  protected restUrl: string = '/wp-json/sujin/v1/flickr/';

  static getInstance() {
    if (!this.instance) {
      this.instance = new FlickrController(FlickrItem);
    }
    return this.instance;
  }
}
