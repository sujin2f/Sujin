import RestItem from 'app/items/rest/index.d';
import { Background as IBackground } from 'app/items/rest/background.d';

export default class Background implements RestItem, IBackground {
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
