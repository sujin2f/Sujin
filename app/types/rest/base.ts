import axios from 'axios';

// Types
import { IRestItem, IRestItemBuilder } from 'app/types/rest/base.d';

/*
 * Magic Classe to create RestController
 * Reference URL
   https://stackoverflow.com/questions/40171533/typescript-call-static-method-of-generic-type
 */

export default class RestController<T extends IRestItem> {
  protected item: IRestItemBuilder<T>;
  protected restUrl: string;
  protected entities: Array<T> = [];
  protected loading = false;
  protected failed = false;
  protected init = false;

  constructor(item) {
    this.item = item;
  }

  /*
   * REST request
   *
   */
  /* eslint-disable @typescript-eslint/no-explicit-any */
  public request(component: any): Promise<void> {
    this.init = true;
    this.loading = true;
    this.failed = false;
    component.forceUpdate();

    return axios.get(this.restUrl)
      .then((response) => {
        if (response.status === 204) {
          this.failed = true;
          return;
        }

        this.postResponse(response);
      }).catch(() => {
        this.failed = true;
      }).finally(() => {
        this.loading = false;
        component.forceUpdate();
      });
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */

  protected postResponse(response): void {
    this.entities = [];
    this.entities = response.data.map((item) => this.item.create(item));
  }

  public getItems(): Array<T> {
    return this.entities;
  }

  public isInit(): boolean {
    return this.init;
  }

  public isLoading(): boolean {
    return this.loading;
  }

  public isFailed(): boolean {
    return this.failed;
  }
}
