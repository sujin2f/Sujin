import RestItem from './index.d';
import { Background as IBackground } from './background.d';

export default class Background implements RestItem, IBackground {
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
