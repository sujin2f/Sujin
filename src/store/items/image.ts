/** store/items/image */

import { Image as ImageType } from 'store/items/schema/image';

export class Image implements ImageType {
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

  constructor(data: any) {
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
