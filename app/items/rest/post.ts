import { RestItem } from 'app/types/rest/base';
import Term from 'app/items/rest/term';
import PrevNext from 'app/items/rest/prevnext';
import Related from 'app/items/rest/related';

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
