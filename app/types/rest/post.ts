/* eslint-disable max-classes-per-file */

import { RestItem } from 'app/types/rest/base';

class Term {
  readonly id: number;
  readonly name: string;
  readonly slug: string;

  constructor(data) {
    this.id = data.term_id;
    this.name = data.name;
    this.slug = data.slug;
  }
}

class PrevNext {
  readonly id: number;
  readonly link: string;
  readonly title: string;
  readonly slug: string;

  constructor(data) {
    this.id = data.id;
    this.link = data.link;
    this.title = decodeURIComponent(data.title);
    this.slug = data.slug;
  }
}

class Related extends PrevNext {
  readonly excerpt: string;
  readonly date: Date;
  readonly meta: {
    [key: string]: string | boolean;
  };
  readonly thumbnail: {
    [key: string]: string;
  };

  constructor(data) {
    super(data);

    this.excerpt = decodeURIComponent(data.excerpt);
    this.date = new Date(data.date);
    this.meta = this.parseMeta(data.meta);
    this.thumbnail = data.thumbnail;
  }

  public parseDate(): { [key: string]: string | number } {
    return {
      day: this.date.getDate(),
      month: this.date.toLocaleString('en-us', { month: 'short' }),
      year: this.date.getFullYear(),
    };
  }

  public getImage(): void {
    console.log('getImage');
  }

  private parseMeta(meta: string): { [key: string]: string } {
    const newMeta = {};

    Object.keys(meta).forEach((mataKey) => {
      const mataValue = meta[mataKey];
      if (typeof mataValue !== 'string') {
        newMeta[mataKey] = mataValue;
      }

      try {
        newMeta[mataKey] = JSON.parse(mataValue) || mataValue;
      } catch (e) {
        newMeta[mataKey] = mataValue;
      }
    });

    return newMeta;
  }
}

export default class Post extends Related implements RestItem {
  readonly content: string;
  readonly postType: string;
  readonly prevnext: {
    prev?: PrevNext;
    next?: PrevNext;
  };
  readonly related: Array<Related>;
  readonly series: Array<PrevNext>;
  readonly tags: Array<Term>;

  constructor(data) {
    super(data);

    this.content = data.content;
    this.postType = data.type;
    this.prevnext = data.prevnext;
    this.related = data.related.map((rp) => new Related(rp));
    this.series = data.series;
    this.tags = data.tags;
  }

  static create(data): Post {
    return new Post(data);
  }
}

/* eslint-enable */
