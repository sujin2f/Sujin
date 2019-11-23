import RestController from 'app/controllers/rest/base';
import PostController from 'app/controllers/rest/post';
import Post from 'app/items/rest/post';

/*
 * Recent Post Controller
 */
export default class RecentPostController extends RestController<Post> {
  public static instance: RecentPostController;

  public static getInstance(): RecentPostController {
    if (!this.instance) {
      this.instance = new RecentPostController(Post);
    }
    return this.instance;
  }

  protected getRestUrl(): string {
    return '/wp-json/sujin/v1/archive/?per_page=4';
  }

  protected postResponse(response): void {
    this.entities = [];
    this.entities = response.data.items.map((item) => this.itemBuilder.create(item));
    this.entities.map((entity: Post) => PostController.getInstance(entity.slug).setFromPost(entity));
  }
}
