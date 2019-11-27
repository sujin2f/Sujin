import RestItem from './index.d';
import { Flickr as IFlickr } from './flickr.d';

export default class Flickr implements RestItem, IFlickr {
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
