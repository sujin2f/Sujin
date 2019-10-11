/// <reference path="base.d.ts" />

import { IRestItem, IRestItemBuilder } from 'RestBase';
import RestController from "./base.ts";

import { isMobile } from 'app/utils/common';
import DEFAULT_BACKGROUND from '../../../assets/images/background/backup-background.jpg';
import DEFAULT_BACKGROUND_MOBILE from '../../../assets/images/background/backup-background-mobile.jpg';

export class BackgroundItem implements IRestItem {
  desktop: string;
  mobile: string;
  title: string;

  constructor(data: any) {
    this.desktop = data.desktop;
    this.mobile = data.mobile;
    this.title = data.title;
  }

  static create(data: any): BackgroundItem {
      return new BackgroundItem(data);
  }
}

export default class BackgroundController extends RestController<BackgroundItem> {
  static instance: BackgroundController;
  protected restUrl: string = '/wp-json/sujin/v1/media/random/';

  static getInstance() {
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
      return isMobile() ? DEFAULT_BACKGROUND_MOBILE : DEFAULT_BACKGROUND;
    }

    const index = Math.floor(Math.random() * this.entities.length);
    return isMobile() ? this.entities[index].mobile : this.entities[index].desktop;
  }
}
