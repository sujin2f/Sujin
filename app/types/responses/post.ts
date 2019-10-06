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
    this.title = data.title;
    this.slug = data.slug;
  }
}

class Related extends PrevNext {
  readonly excerpt: string;
  readonly date: Date;
  readonly meta: {
    [key: string]: string | boolean;
  }; // TODO
  readonly thumbnail: {
    [key: string]: string;
  };

  constructor(data: any) {
    super(data);

    this.excerpt = data.excerpt;
    this.date = new Date(data.date);
    this.meta = this.parseMeta(data.meta);
    this.thumbnail = data.thumbnail;
  }

  parseDate() {
    return {
      day: this.date.getDate(),
      month: this.date.toLocaleString('en-us', { month: 'short' }),
      year: this.date.getFullYear(),
    };
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

export default class Post extends Related {
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
    this.related = data.related;
    this.series = data.series;
    this.tags = data.tags;
  }
}

export type PostObject = {
  [slug: string]: Post | boolean;
}; // true is loading, false is failed
