/** app/items/rest/post */

import SimplePost from 'app/items/rest/simple-post';
import Term from 'app/items/rest/term';

import { IPost } from 'app/items/rest/interface/post';
import { ISimplePost } from 'app/items/rest/interface/simple-post';
import { ITerm } from 'app/items/rest/interface/term';

export default class Post extends SimplePost implements IPost {
  /**
   * Content
   */
  content?: string;
  /**
   * Comment status
   */
  commentStatus?: boolean;
  /**
   * Series
   */
  series?: ISimplePost[];
  /**
   * Prev / Next
   */
  prevNext?: {
    prev?: ISimplePost;
    next?: ISimplePost;
  };
  /**
   * Related contents
   */
  related?: ISimplePost[];
  /**
   * Post Type
   */
  type?: 'post' | 'page';

  constructor(data) {
    super(data);

    this.content = data.content;
    this.commentStatus = data.commentStatus;

    this.series = data.series.map((simple) => new SimplePost(simple));
    this.prevNext = {
      prev: new SimplePost(data.prevNext.prev),
      next: new SimplePost(data.prevNext.next),
    };
    this.related = data.related.map((simple) => new SimplePost(simple));

    this.type = data.type;
  }

  static create(data): IPost {
    return new Post(data);
  }
}
