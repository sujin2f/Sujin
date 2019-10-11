/// <reference path="base.d.ts" />
import { IRestItem, IRestItemBuilder } from 'RestBase';
import RestController from "./base.ts";

class Term {
  readonly id: number;
  readonly name: string;
  readonly slug: string;

  constructor(data: any) {
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

  constructor(data: any) {
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

  constructor(data: any) {
    super(data);

    this.excerpt = decodeURIComponent(data.excerpt);
    this.date = new Date(data.date);
    this.meta = this.parseMeta(data.meta);
    this.thumbnail = data.thumbnail;
  }

  public parseDate() {
    return {
      day: this.date.getDate(),
      month: this.date.toLocaleString('en-us', { month: 'short' }),
      year: this.date.getFullYear(),
    };
  }

  public getImage() {

  }

  private parseMeta(meta) {
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

export default class Post extends Related implements IRestItem {
  readonly content: string;
  readonly postType: string;
  readonly prevnext: {
    prev?: PrevNext;
    next?: PrevNext;
  };
  readonly related: Array<Related>;
  readonly series: Array<PrevNext>;
  readonly tags: Array<Term>;

  constructor(data: any) {
    super(data);

    this.content = data.content;
    this.postType = data.type;
    this.prevnext = data.prevnext;
    this.related = data.related.map((rp) => new Related(rp));
    this.series = data.series;
    this.tags = data.tags;
  }

  static create(data: any): Post {
      return new Post(data);
  }
}

/*
 * Post Controller
 */
export class PostController extends RestController<Post> {
  static instance: {
    [slug: string]: PostController;
  } = {};
  protected entity: Post;

  /*
   * Get multiton object
   */
  static getInstance(slug: string): PostController {
    if (!PostController.instance[slug]) {
      PostController.instance[slug] = new PostController(Post);
      PostController.instance[slug].restUrl = `/wp-json/sujin/v1/posts/?slug=${slug}`;
    }
    return PostController.instance[slug];
  }

  protected postResponse(response) {
    this.entity = this.item.create(response.data);
  }

  public setFromPost(post: Post) {
    this.init = true;
    this.entity = post;
  }

  public getItem(): Post {
    return this.entity;
  }
}
