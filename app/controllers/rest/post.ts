/*
 * Post Controller
 */

import { RestItemBuilder } from 'app/types/rest/base';
import RestController from 'app/controllers/rest/base';
import Post from 'app/items/rest/post';
import RouteController from 'app/controllers/route';

export default class PostController extends RestController<Post> {
  public static instance: {
    [hash: string]: PostController;
  } = {};

  private readonly slug: string;

  protected constructor(itemBuilder: RestItemBuilder<Post>, slug: string) {
    super(itemBuilder);
    this.slug = slug;
  }

  /*
   * Get multiton object
   */
  public static getInstance(slug?: string): PostController {
    const postSlug = slug || RouteController.getInstance().getMatched().slug;

    if (!PostController.instance[postSlug]) {
      PostController.instance[postSlug] = new PostController(Post, postSlug);
    }
    return PostController.instance[postSlug];
  }

  /*
   * Post can be made from archive
   */
  public setFromPost(post: Post): void {
    this.init = true;
    this.entity = post;
  }

  protected getRestUrl(): string {
    return `/wp-json/sujin/v1/post/${this.slug}`;
  }

  protected postResponse(response): void {
    this.entity = this.itemBuilder.create(response.data);
  }
}
