/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface RestItem {}

export interface RestItemBuilder<T extends RestItem> {
  create(data: any): T;
}

/* eslint-enable */
