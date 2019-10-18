export default class GlobalController {
  static instance: GlobalController;

  private title: string;
  public mobileMenu = false;

  static getInstance(): GlobalController {
    if (!this.instance) {
      this.instance = new GlobalController();
    }
    return this.instance;
  }

  public setTitle(title: string): void {
    if (this.title === title) {
      return;
    }
    this.title = title;
    document.title = this.title;
  }

  public setMobileMenu(status?: boolean): void {
    if (typeof status === 'boolean') {
      this.mobileMenu = status;
      return;
    }
    this.mobileMenu = !this.mobileMenu;
  }

  public getMobileMenu(): string {
    return this.mobileMenu ? 'mobile-menu' : '';
  }
}
