import RestController from 'app/controllers/rest/base';
import Post from 'app/types/rest/post';

/*
 * Post Controller
 */
export default class PostController extends RestController<Post> {
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
