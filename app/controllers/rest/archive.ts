/*
 * Archive Controller
 */

import hash from 'object-hash';

import { Types } from 'app/types/rest/archive';
import Post from 'app/types/rest/post';
import RestController from 'app/controllers/rest/base';
import PostController from 'app/controllers/rest/post';
import RouteController from 'app/controllers/route';
import { RestItemBuilder } from 'app/types/rest/base';

// Utiles
import { isMobile } from 'app/utils/common';

// Images
import DEFAULT_BACKGROUND from '../../../assets/images/background/category.jpg';
import DEFAULT_BACKGROUND_MOBILE from '../../../assets/images/background/category-mobile.jpg';

/*
 * Archive Controller
 */
export default class ArchiveController extends RestController<Post> {
  private readonly defaultBackground: string = isMobile() ? DEFAULT_BACKGROUND_MOBILE : DEFAULT_BACKGROUND;
  private readonly pagingOffset: number = isMobile() ? 1 : 5;
  private totalPages: number;

  public static instance: {
    [hash: string]: ArchiveController;
  } = {};
  public readonly type: Types;
  public readonly slug: string;
  public readonly page: number;
  public background: string;
  public description: string;
  public title: string;

  protected constructor(itemBuilder: RestItemBuilder<Post>) {
    super(itemBuilder);
    const matched = RouteController.getInstance().getMatched();
    this.type = matched.type;
    this.slug = matched.slug;
    this.page = matched.page;
  }

  /*
   * Get multiton object
   */
  static getInstance(): ArchiveController {
    const matched = RouteController.getInstance().getMatched();
    const key = hash(matched);

    if (!ArchiveController.instance[key]) {
      ArchiveController.instance[key] = new ArchiveController(Post);
    }

    return ArchiveController.instance[key];
  }

  protected getRestUrl(): string {
    return `/wp-json/sujin/v1/posts/?list_type=${this.type}&keyword=${this.slug}&page=${this.page}&per_page=12`;
  }

  protected postResponse(response): void {
    this.totalPages = parseInt(response.headers['x-wp-totalpages'], 10) || 1;
    this.background = response.headers['x-wp-term-thumbnail'] || this.defaultBackground;
    this.title = decodeURIComponent(response.headers['x-wp-term-name']) || '';
    this.description = decodeURIComponent(response.headers['x-wp-term-description']) || '';

    super.postResponse(response);

    this.entities.map((entity: Post) => PostController.getInstance(entity.slug).setFromPost(entity));
  }

  public getPaging(): Array<number> {
    let entities = [];

    if (!this.totalPages || this.totalPages === 1) {
      return entities;
    }

    const start = (this.page - this.pagingOffset) > 2 ? this.page - this.pagingOffset : 1;
    const end = (this.page + this.pagingOffset) < (this.totalPages - 1) ?
      this.page + this.pagingOffset :
      this.totalPages;

    if (start > 2) {
      entities.push(1);
      entities.push(-1);
    }

    entities = [
      ...entities,
      ...Array.from(Array(end - start + 1).keys()).map((v) => v + start),
    ];

    if (end < this.totalPages - 1) {
      entities.push(-1);
      entities.push(this.totalPages);
    }

    return entities;
  }

  public addComponent(component: ReactComponent): ArchiveController {
    super.addComponent(component);
    return this;
  }

  public request(): ArchiveController {
    super.request();
    return this;
  }
}
