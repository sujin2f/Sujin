/*
 * Global Controller
 *
 * This contains HTML <head.title /> and the status of mobile menu
 * This theme doesn't use Redux to reduce the size of JS
 */

export default class GlobalController {
  private static instance: GlobalController;
  // HTML <head.title />
  private title: string;
  // Is mobile menu toggled?
  private mobileMenu = false;

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
      this.mobileMenu = status;
      return;
    }

    this.mobileMenu = !this.mobileMenu;
  }

  /*
   * Get mobile menu class name
   */
  public getMobileMenu(): string {
    return this.mobileMenu ? 'mobile-menu' : '';
  }

  static getInstance(): GlobalController {
    if (!this.instance) {
      this.instance = new GlobalController();
    }
    return this.instance;
  }
}
