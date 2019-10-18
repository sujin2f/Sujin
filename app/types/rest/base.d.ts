export interface IRestItem {}

export interface IRestItemBuilder<T extends RestItem> {
  create(data: any): T;
}
