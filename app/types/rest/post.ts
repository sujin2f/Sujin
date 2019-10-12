/* eslint-disable max-classes-per-file */
import { IRestItem } from 'app/types/rest/base.d';
import RestController from 'app/types/rest/base';

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

  protected postResponse(response): void {
    this.entity = this.item.create(response.data);
  }

  public setFromPost(post: Post): void {
    this.init = true;
    this.entity = post;
  }

  public getItem(): Post {
    return this.entity;
  }
}

/*
 * Recent Post Controller
 */
export class RecentPostController extends RestController<Post> {
  static instance: RecentPostController;
  protected entity: Array<Post>;
  protected restUrl = '/wp-json/sujin/v1/posts/?per_page=4';

  static getInstance(): RecentPostController {
    if (!this.instance) {
      this.instance = new RecentPostController(Post);
    }
    return this.instance;
  }

  protected postResponse(response): void {
    super.postResponse(response);

    this.entities.map((entity: Post) => PostController.getInstance(entity.slug).setFromPost(entity));
  }
}
/* eslint-enable max-classes-per-file */
