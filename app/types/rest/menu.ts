export default interface Menu {
  ID: number;
  children: Array<Menu>;
  classes: Array<string>;
  target: string;
  title: string;
  url: string;
}

export type MenuArray = Array<Menu> | boolean | undefined; // true is loading, false is failed, undefined is not yet loaded
