/*
 * Post Controller
 */

import RestController from 'app/controllers/rest';
import Post from 'app/items/rest/post';
import RouteController from 'app/controllers/route';

import { IRestController, IRestItemBuilder } from './index.d';

export default class PostController extends RestController<Post> implements IRestController {
  public static instance: {
    [hash: string]: PostController;
  } = {};

  private readonly slug: string;

  protected constructor(itemBuilder: IRestItemBuilder<Post>, slug: string) {
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
