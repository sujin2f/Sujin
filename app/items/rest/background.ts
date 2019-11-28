/** app/items/rest/background */

import { IBackground } from 'app/items/rest/interface/background';

export default class Background implements IBackground {
  desktop: string;
  mobile: string;
  title: string;

  constructor(data) {
    this.desktop = data.desktop;
    this.mobile = data.mobile;
    this.title = data.title;
  }

  static create(data): IBackground {
    return new Background(data);
  }
}
