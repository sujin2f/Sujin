declare module "Menu" {
  export class MenuItem {
    ID: number;
    children: Array<MenuItem>;
    classes: Array<string>;
    target: string;
    title: string;
    url: string;
  }
}
