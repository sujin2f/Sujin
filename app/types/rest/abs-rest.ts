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

interface IMyClass {}

interface IMyClassBuilder<T extends IMyClass> {
    new (): T;
    getInstance(): any;
}

class MyClass implements IMyClass {
    static getInstance() {
        return "";
    }
}

class MyService<T extends IMyClass> {
    private classToCreate: IMyClassBuilder<T>;

    constructor(classToCreate: IMyClassBuilder<T>) {
        this.classToCreate = classToCreate;
    }

    getInstance(): T {
        return this.classToCreate.getInstance();
    }
}

let service = new MyService(MyClass);
let myObject = service.getInstance();
