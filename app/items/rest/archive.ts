/** app/items/rest/archive */

import Post from 'app/items/rest/post';
import Image from 'app/items/rest/image';

import { IArchive } from 'app/items/rest/interface/archive';
import { IPost } from 'app/items/rest/interface/post';
import { IImage } from 'app/items/rest/interface/image';

export default class Archive implements IArchive {
  /**
   * Archive Name
   */
  name?: string;
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
    this.name = data.name;
    this.description = data.description;
    this.thumbnail = new Image(data.thumbnail);
    this.total = data.total;
    this.totalPages = data.totalPages;
    this.items = data.items.map((post) => new Post(post));
  }
}
