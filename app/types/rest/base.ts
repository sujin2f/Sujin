/// <reference path="base.d.ts" />
import axios from 'axios';
// Constants
import { STORE } from 'app/constants/common';
// Types
import { IRestItem, IRestItemBuilder } from 'RestBase';

/*
 * Magic Classe to create RestController
 * Reference URL https://stackoverflow.com/questions/40171533/typescript-call-static-method-of-generic-type
 */

export default class RestController<T extends IRestItem> {
  protected item: IRestItemBuilder<T>;
  protected restUrl: string;
  protected entities: Array<T> = [];
  protected loading: boolean = false;
  protected failed: boolean = false;
  protected init: boolean = false;

  constructor(item) {
    this.item = item;
  }

  /*
   * REST request
   */
  public request(component: any): void {
    this.init = true;
    this.loading = true;
    this.failed = false;
    component.forceUpdate();

    axios.get(this.restUrl)
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

  protected postResponse(response) {
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
