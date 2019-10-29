import axios from 'axios';

import { RestItem, RestItemBuilder } from 'app/types/rest/base';
import { HTTP_RESPONSE_NO_CONTENT } from 'app/constants/common';

/*
 * Magic Classe to create RestController
 * Reference URL
   https://stackoverflow.com/questions/40171533/typescript-call-static-method-of-generic-type
 */

export default class RestController<T extends RestItem> {
  public loading = false;
  public failed = false;
  public init = false;
  public entities: Array<T> = [];
  public entity: T;
  public promise: Promise<void>;

  protected itemBuilder: RestItemBuilder<T>;
  protected components: Array<ReactComponent> = [];

  protected constructor(itemBuilder: RestItemBuilder<T>) {
    this.itemBuilder = itemBuilder;
  }

  /*
   * REST request
   */
  public request(): RestController<T> {
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

  public addComponent(component: ReactComponent): RestController<T> {
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
