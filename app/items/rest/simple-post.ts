/** app/items/rest/simple-post */

import Image from 'app/items/rest/image';

import { ISimplePost } from 'app/items/rest/interface/simple-post';
import { IImage } from 'app/items/rest/interface/image';

export default class SimplePost implements ISimplePost {
  /**
   * Unique ID
   */
  id: number;
  /**
   * Post slug
   */
  slug: string;
  /**
   * Date
   */
  date: string;
  /**
   * Link URL
   */
  link: string;
  /**
   * Title
   */
  title: string;
  /**
   * Meta data
   */
  meta?: {
    background?: IImage;
    icon?: IImage;
    list?: IImage;
    title?: IImage;
    thumbnail?: IImage;
    backgroundColor?: string;
    useBackgroundColor?: boolean;
  };
  thumbnail?: IImage;

  constructor(data) {
    this.id = data.id;
    this.slug = data.slug;
    this.link = data.link;
    this.title = decodeURIComponent(data.title);
    this.date = data.date;
    this.meta = {
      background: new Image(data.meta.background),
      icon: new Image(data.meta.icon),
      list: new Image(data.meta.list),
      title: new Image(data.meta.title),
      thumbnail: new Image(data.meta.thumbnail),
      backgroundColor: data.meta.backgroundColor,
      useBackgroundColor: data.meta.useBackgroundColor,
    };
    this.thumbnail = new Image(data.thumbnail);
  }

  public parseDate(): { [key: string]: string | number } {
    const date = new Date(this.date);

    return {
      day: date.getDate(),
      month: date.toLocaleString('en-us', { month: 'short' }),
      year: date.getFullYear(),
    };
  }
}
