export interface IRestItemBuilder<T extends RestItem> {
  create(data: any): T;
}

export interface IRestController {
  [key: string]: any;
}
