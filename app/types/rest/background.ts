import axios from 'axios';

// Constants
import { STORE } from 'app/constants/common';
import { isMobile } from 'app/utils/common';

import DEFAULT_BACKGROUND from '../../../assets/images/background/backup-background.jpg';
import DEFAULT_BACKGROUND_MOBILE from '../../../assets/images/background/backup-background-mobile.jpg';

export class MainBackground {
  desktop: string;
  mobile: string;
  title: string;

  constructor(data: any) {
    this.desktop = data.desktop;
    this.mobile = data.mobile;
    this.title = data.title;
  }
}

export default class MainBackgroundController {
  static instance: MainBackgroundController;
  readonly REST_URL = '/wp-json/sujin/v1/media/random/';

  entities: Array<MainBackground> = [];
  loading: boolean = false;
  failed: boolean = false;
  init: boolean = false;

  /*
   * Get singleton object
   */
  static getInstance(): MainBackgroundController {
    if (!MainBackgroundController.instance) {
      MainBackgroundController.instance = new MainBackgroundController();
    }
    return MainBackgroundController.instance;
  }

  /*
   * REST request
   */
  public request(component: any): void {
    this.init = true;
    this.loading = true;
    this.failed = false;
    component.forceUpdate();

    axios.get(this.REST_URL)
      .then((response) => {
        if (response.status === 204) {
          this.loading = false;
          this.failed = true;
          return;
        }

        this.entities = [];
        this.entities = response.data.map((item) => new MainBackground(item));
        this.loading = false;
        this.failed = false;
      }).catch(() => {
        this.loading = false;
        this.failed = true;
      }).finally(() => {
        component.forceUpdate();
      });
  }

  public getBackgroundImage() {
    if (this.failed) {
      return isMobile() ? DEFAULT_BACKGROUND_MOBILE : DEFAULT_BACKGROUND;
    }

    if (this.loading || !this.init) {
      return '';
    }

    const index = Math.floor(Math.random() * this.entities.length);
    return isMobile() ? this.entities[index].mobile : this.entities[index].desktop;
  }
}
