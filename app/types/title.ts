export default class TitleController {
  static instance: TitleController;

  title: string;

  static getInstance(): TitleController {
    if (!this.instance) {
      this.instance = new TitleController();
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
}
