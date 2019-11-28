/**  app/controllers/rest */

import axios from 'axios';

import { HTTP_RESPONSE_NO_CONTENT } from 'app/constants/common';

import { IRestItem } from 'app/items/rest/interface';

export interface IRestItemBuilder<T extends IRestItem> {
  create(data: any): T; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface IRestController {
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

/*
 * RestController base class
 *
 * @param T Rest item need to be created from the response
 * @ref   https://stackoverflow.com/questions/40171533/typescript-call-static-method-of-generic-type
 */
export abstract class RestController<T extends IRestItem> implements IRestController {
  public loading = false;
  public failed = false;
  public init = false;
  public entities: Array<T> = [];
  public entity: T;
  public promise: Promise<void>;

  protected itemBuilder: IRestItemBuilder<T>;
  protected components: Array<ReactComponent> = [];

  protected constructor(itemBuilder: IRestItemBuilder<T>) {
    this.itemBuilder = itemBuilder;
  }

  /*
   * REST request
   */
  public request(): IRestController {
    if (this.init) {
      return this;
    }

    this.init = true;
    this.loading = true;
    this.failed = false;
    this.forceUpdate();

    this.promise = axios.get(this.getRestUrl())
      .then((response) => {
        if (response.status === HTTP_RESPONSE_NO_CONTENT) {
          this.failed = true;
          return;
        }

        this.postResponse(response);
      }).catch(() => {
        this.failed = true;
      }).finally(() => {
        this.loading = false;
        this.forceUpdate();
      });

    return this;
  }

  public addComponent(component: ReactComponent): IRestController {
    this.components = [component];
    return this;
  }

  protected forceUpdate(): void {
    this.components[0].forceUpdate();
  }

  protected getRestUrl(): string {
    return '';
  }

  /*
   * What happens for response success
   */
  protected postResponse(response): void {
    this.entities = [];
    this.entities = response.data.map((item) => this.itemBuilder.create(item));
  }
}
