/*
 * Post Controller
 */

import RestController from 'app/controllers/rest/base';
import Post from 'app/types/rest/post';
import RouteController from 'app/controllers/route';
import { RestItemBuilder } from 'app/types/rest/base';

export default class PostController extends RestController<Post> {
  private readonly slug: string;
  public static instance: {
    [hash: string]: PostController;
  } = {};

  protected constructor(itemBuilder: RestItemBuilder<Post>, slug: string) {
    super(itemBuilder);
    this.slug = slug;
  }

  protected getRestUrl(): string {
    return `/wp-json/sujin/v1/posts/?slug=${this.slug}`;
  }

  protected postResponse(response): void {
    this.entity = this.itemBuilder.create(response.data);
  }

  /*
   * Post can be made from archive
   */
  public setFromPost(post: Post): void {
    this.init = true;
    this.entity = post;
  }

  /*
   * Get multiton object
   */
  static getInstance(slug?: string): PostController {
    const postSlug = slug || RouteController.getInstance().getMatched().slug;

    if (!PostController.instance[postSlug]) {
      PostController.instance[postSlug] = new PostController(Post, postSlug);
    }
    return PostController.instance[postSlug];
  }
}
