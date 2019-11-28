import { RestController, IRestController } from 'app/controllers/rest';
import PostController from 'app/controllers/rest/post';
import Post from 'app/items/rest/post';
import { IPost } from 'app/items/rest/interface/post';

/*
 * Recent Post Controller
 */
export default class RecentPostController extends RestController<IPost> {
  public static instance: RecentPostController;

  public static getInstance(): IRestController {
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
    this.entities.map((entity: IPost) => PostController.getInstance(entity.slug).setFromPost(entity));
  }
}
