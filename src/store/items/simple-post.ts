/** store/items/simple-post */

import Image from 'store/items/image';
import Term from 'store/items/term';

import { ISimplePost } from 'store/items/interface/simple-post';
import { IImage } from 'store/items/interface/image';
import { ITerm } from 'store/items/interface/term';

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
   * Title
   */
  title: string;
  /**
   * Excerpt
   */
  excerpt?: string;
  /**
   * Date
   */
  date: string;
  /**
   * Link URL
   */
  link: string;
  /**
   * Tags
   */
  tags?: ITerm[];
  thumbnail?: IImage;
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
    this.excerpt = decodeURIComponent(data.excerpt);
    this.tags = (data.tags && data.tags.map((tag) => new Term(tag))) || [];
  }

  public parseDate(): { [key: string]: string|number } {
    const date = new Date(this.date);

    return {
      day: date.getDate(),
      month: date.toLocaleString('en-us', { month: 'short' }),
      year: date.getFullYear(),
    };
  }
}
