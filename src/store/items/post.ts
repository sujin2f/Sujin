/** store/items/post */

import { SimplePost } from 'store/items/simple-post';

import { Post as TypePost } from 'store/items/schema/post';

export class Post extends SimplePost implements TypePost {
  /**
   * Content
   */
  content: string
  /**
   * Comment status
   */
  commentStatus?: boolean
  /**
   * Series
   */
  series: SimplePost[]
  /**
   * Prev / Next
   */
  prevNext: {
    prev?: SimplePost
    next?: SimplePost
  }
  /**
   * Related contents
   */
  related: SimplePost[]
  /**
   * Post Type
   */
  type: 'post' | 'page'

  constructor(data: any) {
    super(data);

    this.content = data.content;
    this.commentStatus = data.commentStatus;

    this.series = data.series.map((simple: SimplePost) => new SimplePost(simple));
    this.prevNext = {
      prev: data.prevNext.prev ? new SimplePost(data.prevNext.prev) : undefined,
      next: data.prevNext.next ? new SimplePost(data.prevNext.next) : undefined,
    };
    this.related = data.related.map((simple: SimplePost) => new SimplePost(simple));

    this.type = data.type;
  }
}
