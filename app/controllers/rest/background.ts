import { isMobile } from 'app/utils/common';

// Types
import BackgroundItem from 'app/types/rest/background';
import RestController from 'app/controllers/rest/base';

import DEFAULT_BG from '../../../assets/images/background/backup-background.jpg';
import DEFAULT_BG_MOBILE from '../../../assets/images/background/backup-background-mobile.jpg';

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
