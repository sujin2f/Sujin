declare module "RestBase" {
  export interface IRestItem {}

  export interface IRestItemBuilder<T extends RestItem> {
      new (): T;
      create(data: any): T;
  }
}

