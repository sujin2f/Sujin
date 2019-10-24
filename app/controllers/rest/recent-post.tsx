import RestController from 'app/controllers/rest/base';
import PostController from 'app/controllers/rest/post';
import Post from 'app/types/rest/post';

/*
 * Recent Post Controller
 */
export default class RecentPostController extends RestController<Post> {
  static instance: RecentPostController;

  static getInstance(): RecentPostController {
    if (!this.instance) {
      this.instance = new RecentPostController(Post);
    }
    return this.instance;
  }

  protected getRestUrl(): string {
    return '/wp-json/sujin/v1/posts/?per_page=4';
  }

  protected postResponse(response): void {
    super.postResponse(response);

    this.entities.map((entity: Post) => PostController.getInstance(entity.slug).setFromPost(entity));
  }
}
