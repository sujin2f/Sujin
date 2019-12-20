/**  app/controllers/rest/background */

// Controller
import { RestController, IRestController } from 'app/controllers/rest';

// Function
import { isMobile } from 'app/utils/common';

// Item
import Background from 'app/items/rest/background';
import { IBackground } from 'app/items/rest/interface/background';

// Images
import DEFAULT_BG from '../../../assets/images/background/backup-background.jpg';
import DEFAULT_BG_MOBILE from '../../../assets/images/background/backup-background-mobile.jpg';

/*
 * Background Controller
 */
export default class BackgroundController extends RestController<IBackground> {
  public static instance: BackgroundController;

  public static getInstance(): IRestController {
    if (!this.instance) {
      this.instance = new BackgroundController(Background);
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

  public addComponent(component: ReactComponent): IRestController {
    super.addComponent(component);
    return this;
  }

  public request(): IRestController {
    super.request();
    return this;
  }

  protected getRestUrl(): string {
    return '/wp-json/sujin/v1/background/random/';
  }
}
