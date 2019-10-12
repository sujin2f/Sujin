/* eslint-disable max-classes-per-file */
import { IRestItem } from 'app/types/rest/base.d';
import RestController from 'app/types/rest/base';

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

  constructor(data) {
    this.title = data.title;
    this.link = data.link;
    this.media = data.media;
  }

  static create(data): FlickrItem {
    return new FlickrItem(data);
  }
}

/*
 * Flickr Controller
 */
export default class FlickrController extends RestController<FlickrItem> {
  static instance: FlickrController;
  protected restUrl = '/wp-json/sujin/v1/flickr/';

  static getInstance(): FlickrController {
    if (!this.instance) {
      this.instance = new FlickrController(FlickrItem);
    }
    return this.instance;
  }
}
/* eslint-enable max-classes-per-file */
