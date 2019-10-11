// TODO https://stackoverflow.com/questions/40171533/typescript-call-static-method-of-generic-type
import axios from 'axios';

// Constants
import { STORE } from 'app/constants/common';

export default abstract class RestObject<T> {
  static instance: any;
  restUrl: string;
  entities: Array<T> = [];
  loading: boolean = false;
  failed: boolean = false;
  init: boolean = false;
  item: T;

  /*
   * Get singleton object
   */
  static getInstance(type, item) {
    if (!type.instance) {
      type.instance = new type();
      type.instance.item = item;
    }
    return type.instance;
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
          this.loading = false;
          this.failed = true;
          return;
        }

        this.entities = [];
        // this.entities = response.data.map((item) => new T(item));
        this.loading = false;
        this.failed = false;
      }).catch(() => {
        this.loading = false;
        this.failed = true;
      }).finally(() => {
        component.forceUpdate();
      });
  }
}

// To make Object
// interface IMyClassBuilder<T extends IMyClass> {
//     new (): T;
//     getInstance(): T;
// };
// Object


class MyClass {
  n: number;
  constructor(n: number) {
      this.n = n;
  }

  static create(n: number): MyClass {
      return new MyClass(n);
  }
}

interface IMyClassBuilder<T> {
    new (): T;
    create(n: number): T;
}

class Singleton<T extends MyClass> {
  private item: IMyClassBuilder<T>;
  static instance: any;

  constructor(item: IMyClassBuilder<T>) {
    this.item = item;
  }
  static getInstance(item: any): any {
    if (!this.instance) {
      this.instance = new Singleton(item);
    }
    console.log(this.instance.item);
    return this.instance;
  }
  getNewItem(n: number) {
    return this.item.create(n);
  }
}
let controller = Singleton.getInstance(MyClass);
console.log(controller.getNewItem(1));
console.log(controller.getNewItem(2));
