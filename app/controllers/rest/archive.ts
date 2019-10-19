/*
 * Archive Controller
 */

// Types
import Types from 'app/types/rest/archive';
import Post from 'app/types/rest/post';
import RestController from 'app/controllers/rest/base';
import PostController from 'app/controllers/rest/post';

// Utiles
import { isMobile } from 'app/utils/common';

// Images
import DEFAULT_BACKGROUND from '../../../assets/images/background/category.jpg';
import DEFAULT_BACKGROUND_MOBILE from '../../../assets/images/background/category-mobile.jpg';

/*
 * Archive Controller
 */
export default class ArchiveController extends RestController<Post> {
  static instance: {
    [type: string]: {
      [slug: string]: {
        [page: number]: ArchiveController;
      };
    };
  } = {};

  private readonly defaultBackground = isMobile() ? DEFAULT_BACKGROUND_MOBILE : DEFAULT_BACKGROUND;
  private readonly pagingOffset: number = isMobile() ? 1 : 5;
  type: Types;
  slug: string;
  page: number;
  private totalPages: number;
  background: string;
  description: string;
  title: string;

  /*
   * Get multiton object
   */
  static getInstance(type: Types, slug: string, page: number): ArchiveController {
    if (!ArchiveController.instance[type]) {
      ArchiveController.instance[type] = {};
    }

    if (!ArchiveController.instance[type][slug]) {
      ArchiveController.instance[type][slug] = {};
    }

    if (!ArchiveController.instance[type][slug][page]) {
      ArchiveController.instance[type][slug][page] = new ArchiveController(Post);
      ArchiveController.instance[type][slug][page].restUrl = `/wp-json/sujin/v1/posts/?list_type=${type}&keyword=${slug}&page=${page}&per_page=12`;
      ArchiveController.instance[type][slug][page].type = type;
      ArchiveController.instance[type][slug][page].slug = slug;
      ArchiveController.instance[type][slug][page].page = page;
    }

    return ArchiveController.instance[type][slug][page];
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
}
