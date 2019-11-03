/*
 * Global Controller
 *
 * This contains HTML <head.title />, the status of mobile menu, and the scrolling
 */

import { Scrolled, MobileMenu } from 'app/constants/enum';
import { TOP_MENU_SCROLLED_POSITION } from 'app/constants/common';

export default class GlobalController {
  // Singleton
  private static instance: GlobalController;

  // CSS classes: Enum(No & Yes)
  public mobileMenuClass: MobileMenu = MobileMenu.No;
  public scrollClass: Scrolled = Scrolled.No;

  // React Component to be refreshed
  private component: ReactComponent;

  // HTML <head.title />
  private title: string;

  // Get a singleton controller
  public static getInstance(component?: ReactComponent): GlobalController {
    if (!this.instance) {
      this.instance = new GlobalController();
    }

    if (component) {
      return this.instance.setComponent(component);
    }

    return this.instance;
  }

  // Set a React Component
  public setComponent(component?: ReactComponent): GlobalController {
    this.component = component;
    return this;
  }

  // Triggers the window event: scroll
  public setScroll(): void {
    if (typeof window !== 'undefined' && this.component) {
      window.addEventListener('scroll', () => {
        const scrolled = this.isScrolled();

        if (scrolled === false) {
          return;
        }

        if (this.component) {
          this.component.forceUpdate();
        }
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
