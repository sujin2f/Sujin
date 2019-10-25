/*
 * Global Controller
 *
 * This contains HTML <head.title />, the status of mobile menu, and the scrolling
 * This theme doesn't use Redux to reduce the size of JS
 */

import { Scrolled, MobileMenu } from 'app/types/global';
import { TOP_MENU_SCROLLED_POSITION } from 'app/constants/common';

export default class GlobalController {
  public mobileMenuClass: MobileMenu = MobileMenu.No;
  public scrollClass: Scrolled = Scrolled.No;

  private static instance: GlobalController;
  private component;
  // HTML <head.title />
  private title: string;

  /* eslint-disable @typescript-eslint/no-explicit-any */
  private constructor(component?: any) {
    this.component = component;
  }
  /* eslint-enable */

  public setScroll(): void {
    if (typeof window !== 'undefined' && this.component) {
      window.addEventListener('scroll', () => {
        const scrolled = this.isScrolled();

        if (scrolled === false) {
          return;
        }

        this.component.forceUpdate();
      });
    }
  }

  /*
   * Change HTML <head.title />
   */
  public setTitle(title: string): void {
    // Ignore if the same title comes
    if (this.title === title) {
      return;
    }

    this.title = title;
    document.title = this.title;
  }

  // No parameter means toggling
  public setMobileMenu(status?: boolean): void {
    if (typeof status === 'boolean') {
      this.mobileMenuClass = status ? MobileMenu.Yes : MobileMenu.No;
      return;
    }

    this.mobileMenuClass = this.mobileMenuClass === MobileMenu.Yes ? MobileMenu.No : MobileMenu.Yes;

    if (this.component) {
      this.component.forceUpdate();
    }
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  public static getInstance(component?: any): GlobalController {
    if (!this.instance) {
      this.instance = new GlobalController(component);
    }
    return this.instance;
  }
  /* eslint-enable */

  private isScrolled(): boolean {
    if (window.scrollY > TOP_MENU_SCROLLED_POSITION && this.scrollClass === Scrolled.No) {
      this.scrollClass = Scrolled.Yes;
      return true;
    }

    if (window.scrollY <= TOP_MENU_SCROLLED_POSITION && this.scrollClass === Scrolled.Yes) {
      this.scrollClass = Scrolled.No;
      return true;
    }

    return false;
  }
}
