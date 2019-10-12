/* eslint-disable max-classes-per-file */
import { isMobile } from 'app/utils/common';

// Types
import { IRestItem } from 'app/types/rest/base.d';
import RestController from 'app/types/rest/base';

import DEFAULT_BG from '../../../assets/images/background/backup-background.jpg';
import DEFAULT_BG_MOBILE from '../../../assets/images/background/backup-background-mobile.jpg';

export class BackgroundItem implements IRestItem {
  desktop: string;
  mobile: string;
  title: string;

  constructor(data) {
    this.desktop = data.desktop;
    this.mobile = data.mobile;
    this.title = data.title;
  }

  static create(data): BackgroundItem {
    return new BackgroundItem(data);
  }
}

export default class BackgroundController extends RestController<BackgroundItem> {
  static instance: BackgroundController;
  protected restUrl = '/wp-json/sujin/v1/media/random/';

  static getInstance(): BackgroundController {
    if (!this.instance) {
      this.instance = new BackgroundController(BackgroundItem);
    }
    return this.instance;
  }

  public getBackgroundImage(): string {
    if (this.loading || !this.init) {
      return '';
    }

    if (this.failed || !this.entities.length) {
      return isMobile() ? DEFAULT_BG_MOBILE : DEFAULT_BG;
    }

    const index = Math.floor(Math.random() * this.entities.length);
    return isMobile() ? this.entities[index].mobile : this.entities[index].desktop;
  }
}
/* eslint-enable max-classes-per-file */
