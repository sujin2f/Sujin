/**  app/controllers/rest/archive */

import hash from 'object-hash';

// Enum & Const
import { TermTypes } from 'app/constants/enum';
import { PAGE_OFFSET } from 'app/constants/common';

// Item
import Post from 'app/items/rest/post';
import { IPost } from 'app/items/rest/interface/post';
import Archive from 'app/items/rest/archive';
import { IArchive } from 'app/items/rest/interface/archive';

// Controller
import {
  RestController,
  IRestController,
  IRestItemBuilder,
} from 'app/controllers/rest';
import PostController from 'app/controllers/rest/post';
import RouteController from 'app/controllers/route';

// Function
import { isMobile } from 'app/utils/common';

/*
 * Archive Controller
 */
export default class ArchiveController extends RestController<IArchive> {
  public static instance: {
    [hash: string]: ArchiveController;
  } = {};
  public readonly type: TermTypes;
  public readonly slug: string;
  public readonly page: number;
  public background: string;
  public description: string;
  public title: string;

  private readonly pagingOffset: number = isMobile() ? 1 : PAGE_OFFSET;
  private totalPages: number;

  protected constructor(itemBuilder: IRestItemBuilder<IArchive>) {
    super(itemBuilder);
    const matched = RouteController.getInstance().getMatched();
    this.type = matched.type;
    this.slug = matched.slug;
    this.page = matched.page;
  }

  /*
   * Get multiton object
   */
  public static getInstance(): IRestController {
    const matched = RouteController.getInstance().getMatched();
    const key = hash(matched);

    if (!ArchiveController.instance[key]) {
      ArchiveController.instance[key] = new ArchiveController(Archive);
    }

    return ArchiveController.instance[key];
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

  protected getRestUrl(): string {
    return `/wp-json/sujin/v1/archive/${this.type}/${this.slug}/${this.page}`;
  }

  protected postResponse(response): void {
    this.entity =this.itemBuilder.create(response.data);
    this.entity.items.map((entity: IPost) => PostController.getInstance(entity.slug).setFromPost(entity));

    this.totalPages = parseInt(response.data.totalPages, 10) || 1;
    this.background = response.data.thumbnail;
    this.title = decodeURIComponent(response.data.name) || '';
    this.description = decodeURIComponent(response.data.description) || '';
  }
}
