import RestItem from 'app/items/rest/index.d';
import { Image as IImage } from 'app/items/rest/image.d';

export default class Image implements RestItem, IImage {
  /**
   * Large size image
   */
  large?: string;
  /**
   * Medium size image
   */
  medium?: string;
  /**
   * Small size image
   */
  small?: string;
  /**
   * Tiny size image
   */
  tiny?: string;

  constructor(data) {
    this.large = data.large;
    this.medium = data.medium;
    this.small = data.small;
    this.tiny = data.tiny;
  }
}
