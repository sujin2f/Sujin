import { RestItem } from 'app/types/rest/base';

export default class FlickrItem implements RestItem {
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
