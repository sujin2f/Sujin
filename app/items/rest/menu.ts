import RestItem from './index.d';

export default class Menu implements RestItem {
  ID: number;
  children: Array<Menu>;
  classes: Array<string>;
  target: string;
  title: string;
  url: string;

  constructor(data) {
    this.ID = data.ID;
    this.children = data.children;
    this.classes = data.classes;
    this.target = data.target;
    this.title = data.title;
    this.url = data.url;
  }

  static create(data): Menu {
    return new Menu(data);
  }
}
