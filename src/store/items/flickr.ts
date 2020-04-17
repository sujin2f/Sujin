/** store/items/flickr */

import { IFlickr } from 'store/items/interface/flickr';

export default class Flickr implements IFlickr {
  /**
   * The title of the photo.
   */
  title: string;
  /**
   * Flickr URL for the image
   */
  link: string;
  /**
   * Image URLs
   */
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

  static create(data): IFlickr {
    return new Flickr(data);
  }
}
