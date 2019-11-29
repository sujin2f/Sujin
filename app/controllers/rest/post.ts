/**  app/controllers/rest/post */

// Controller
import {
  RestController,
  IRestController,
  IRestItemBuilder,
} from 'app/controllers/rest';
import RouteController from 'app/controllers/route';

// Item
import Post from 'app/items/rest/post';
import { IPost } from 'app/items/rest/interface/post';

/*
 * Post Controller
 */
export default class PostController extends RestController<IPost> {
  public static instance: {
    [hash: string]: PostController;
  } = {};

  private readonly slug: string;

  protected constructor(itemBuilder: IRestItemBuilder<IPost>, slug: string) {
    super(itemBuilder);
    this.slug = slug;
  }

  /*
   * Get multiton object
   */
  public static getInstance(slug?: string): IRestController {
    const postSlug = slug || RouteController.getInstance().getMatched().slug;
    if (!PostController.instance[postSlug]) {
      PostController.instance[postSlug] = new PostController(Post, postSlug);
    }
    return PostController.instance[postSlug];
  }

  /*
   * Post can be made from archive
   */
  public setFromPost(post: IPost): void {
    if (this.entity) {
      return;
    }

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
