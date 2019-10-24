import { RestItem } from 'app/types/rest/base';

export default class MenuItem implements RestItem {
  ID: number;
  children: Array<MenuItem>;
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

  static create(data): MenuItem {
    return new MenuItem(data);
  }
}
