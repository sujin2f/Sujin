import RestItem from 'app/items/rest/index.d';
import { Archive as IArchive } from 'app/items/rest/archive.d';

import Post from 'app/items/rest/post';
import { Post as IPost } from 'app/items/rest/post.d';

import Image from 'app/items/rest/image';
import { Image as IImage } from 'app/items/rest/image.d';

export default class Archive implements RestItem, IArchive {
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
