import axios from 'axios';

// Types
import { RestItem, RestItemBuilder } from 'app/types/rest/base';

/*
 * Magic Classe to create RestController
 * Reference URL
   https://stackoverflow.com/questions/40171533/typescript-call-static-method-of-generic-type
 */

export default class RestController<T extends RestItem> {
  protected item: RestItemBuilder<T>;
  protected restUrl: string;
  protected entities: Array<T> = [];
  protected loading = false;
  protected failed = false;
  protected init = false;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  private components: Array<any> = [];
  /* eslint-enable */

  constructor(item) {
    this.item = item;
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  private addComponent(component: any): void {
    this.components.push(component);
    this.components = Array.from(new Set(this.components));
  }
  /* eslint-enable */

  private forceUpdate(): void {
    this.components.forEach((component) => component.forceUpdate());
  }

  /*
   * REST request
   *
   */
  /* eslint-disable @typescript-eslint/no-explicit-any */
  public request(component: any): Promise<void> {
    this.addComponent(component);
    if (this.init) {
      return null;
    }

    this.init = true;
    this.loading = true;
    this.failed = false;
    this.forceUpdate();

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
        this.forceUpdate();
      });
  }
  /* eslint-enable */

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
