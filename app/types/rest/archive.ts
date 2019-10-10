// TODO Push into Post, getPaging
import axios from 'axios';

// Types
import Post from './post';
// Constants
import { STORE } from 'app/constants/common';
// Utiles
import { isMobile } from 'app/utils/common';
// Images
import DEFAULT_BACKGROUND from '../../../assets/images/background/category.jpg';
import DEFAULT_BACKGROUND_MOBILE from '../../../assets/images/background/category-mobile.jpg';

export enum Types {
  Category = 'category',
  Tag = 'tag',
  Search = 'search',
}

/*
 * Archive Controller
 */
export default class ArchiveController {
  static instance: {
    [type: string]: {
      [slug: string]: {
        [page: number]: ArchiveController;
      }
    }
  } = {};
  restUrl: string;

  readonly defaultBackground: string = isMobile() ? DEFAULT_BACKGROUND_MOBILE : DEFAULT_BACKGROUND;
  readonly pagingOffset: number = 5
  type: Types;
  slug: string;
  page: number;

  totalPages: number;
  background: string;
  description: string;
  title: string;

  entities: Array<Post> = [];
  loading: boolean = false;
  failed: boolean = false;
  init: boolean = false;

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
      ArchiveController.instance[type][slug][page] = new ArchiveController();
      ArchiveController.instance[type][slug][page].restUrl = `/wp-json/sujin/v1/posts/?list_type=${type}&keyword=${slug}&page=${page}&per_page=12`;
      ArchiveController.instance[type][slug][page].type = type;
      ArchiveController.instance[type][slug][page].slug = slug;
      ArchiveController.instance[type][slug][page].page = page;
    }

    return ArchiveController.instance[type][slug][page];
  }

  /*
   * REST request
   */
  public request(component: any): any {
    this.init = true;
    this.loading = true;
    this.failed = false;
    component.forceUpdate();

    return axios.get(this.restUrl)
      .then((response) => {
        if (response.status === 204) {
          this.failed = true;
          return;
        }

        this.totalPages = parseInt(response.headers['x-wp-totalpages'], 10) || 1;
        this.background = response.headers['x-wp-term-thumbnail'] || this.defaultBackground;
        this.title = decodeURIComponent(response.headers['x-wp-term-name']) || '';
        this.description = decodeURIComponent(response.headers['x-wp-term-description']) || '';

        this.entities = [];
        this.entities = response.data.map((item) => new Post(item));
      }).catch(() => {
        this.failed = true;
      }).finally(() => {
        this.loading = false;
        component.forceUpdate();
      });
  }

  public getPaging(): Array<number> {
    let entities = [];

    if (!this.totalPages || 1 === this.totalPages) {
      return entities;
    }

    const start = (this.page - this.pagingOffset) > 2 ? this.page - this.pagingOffset : 1;
    const end = (this.page + this.pagingOffset) < (this.totalPages - 1) ? this.page + this.pagingOffset : this.totalPages;

    if (start > 2) {
      entities.push(1);
      entities.push(-1);
    }

    entities = [
      ...entities,
      ...Array.from(Array(end - start + 1).keys()).map(v => v + start),
    ];

    if (end < this.totalPages - 1) {
      entities.push(-1);
      entities.push(this.totalPages);
    }

    return entities;
  }
}
