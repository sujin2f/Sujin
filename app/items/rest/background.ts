import { RestItem } from 'app/types/rest/base';

export default class Background implements RestItem {
  desktop: string;
  mobile: string;
  title: string;

  constructor(data) {
    this.desktop = data.desktop;
    this.mobile = data.mobile;
    this.title = data.title;
  }

  static create(data): Background {
    return new Background(data);
  }
}
