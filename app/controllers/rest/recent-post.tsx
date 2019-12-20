import { RestController, IRestController } from 'app/controllers/rest';
import PostController from 'app/controllers/rest/post';

import Archive from 'app/items/rest/archive';
import { IArchive } from 'app/items/rest/interface/archive';
import { IPost } from 'app/items/rest/interface/post';

/*
 * Recent Post Controller
 */
export default class RecentPostController extends RestController<IArchive> {
  public static instance: RecentPostController;

  public static getInstance(): IRestController {
    if (!this.instance) {
      this.instance = new RecentPostController(Archive);
    }
    return this.instance;
  }

  protected getRestUrl(): string {
    return '/wp-json/sujin/v1/archive/?per_page=4';
  }

  protected postResponse(response): void {
    this.entity = this.itemBuilder.create(response.data);
    this.entity.items.map((entity: IPost) => PostController.getInstance(entity.slug).setFromPost(entity));
  }
}
