/** store/items/image */

import { IImage } from 'store/items/interface/image';

export default class Image implements IImage {
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
    if (!data) {
      this.large = '';
      this.medium = '';
      this.small = '';
      this.tiny = '';
      return;
    }

    this.large = data.large;
    this.medium = data.medium;
    this.small = data.small;
    this.tiny = data.tiny;
  }
}
