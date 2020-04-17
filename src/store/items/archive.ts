/** store/items/archive */

import { Post } from 'store/items/post';
import Image from 'store/items/image';

import { IArchive } from 'store/items/interface/archive';
import { IPost } from 'store/items/interface/post';
import { IImage } from 'store/items/interface/image';

export class Archive implements IArchive {
  /**
   * Archive Name
   */
  title?: string;
  /**
   * Archive Description
   */
  description?: string;
  thumbnail?: IImage;
  /**
   * Total number of posts
   */
  total?: number;
  /**
   * Total number of page
   */
  totalPages?: number;
  /**
   * Posts
   */
  items?: IPost[];

  constructor(data) {
    this.title = decodeURIComponent(data.title) || '';
    this.description = decodeURIComponent(data.description) || '';
    this.thumbnail = new Image(data.thumbnail);
    this.total = data.total;
    this.totalPages = parseInt(data.totalPages, 10) || 1;

    this.items = data.items.map((post) => new Post(post));
  }
}
