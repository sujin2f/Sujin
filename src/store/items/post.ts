/** store/items/post */

import SimplePost from 'store/items/simple-post';

import { IPost } from 'store/items/interface/post';
import { ISimplePost } from 'store/items/interface/simple-post';

export class Post extends SimplePost implements IPost {
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
  type?: 'post'|'page';

  constructor(data) {
    super(data);

    this.content = data.content;
    this.commentStatus = data.commentStatus;

    this.series = data.series.map((simple) => new SimplePost(simple));
    this.prevNext = {
      prev: data.prevNext.prev ? new SimplePost(data.prevNext.prev) : null,
      next: data.prevNext.next ? new SimplePost(data.prevNext.next) : null,
    };
    this.related = data.related.map((simple) => new SimplePost(simple));

    this.type = data.type;
  }
}
