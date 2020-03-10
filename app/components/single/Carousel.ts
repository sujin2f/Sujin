import { ATTR, CLASS_NAME, TAG_NAME } from 'app/constants/dom';

export class Carousel {
  private frame: HTMLImageElement;
  private navItems: HTMLCollection;
  private next: HTMLButtonElement;
  private prev: HTMLButtonElement;

  public constructor(element: HTMLElement) {
    // Nav Images
    const nav = element.getElementsByTagName(TAG_NAME.NAV);
    this.navItems = nav.item(0).getElementsByTagName(TAG_NAME.IMAGE);

    // Frame
    this.frame = element.querySelector(`.${CLASS_NAME.carousel.PICTURE_FRAME} ${TAG_NAME.IMAGE}`) as HTMLImageElement;

    // Buttons
    this.prev = element.getElementsByClassName(CLASS_NAME.carousel.PREV).item(0) as HTMLButtonElement;
    this.next = element.getElementsByClassName(CLASS_NAME.carousel.NEXT).item(0) as HTMLButtonElement;

    this.bindEvents();
  }

  private bindEvents(): void {
    Array.from(this.navItems).forEach((element: HTMLImageElement) => {
      element.addEventListener('click', (e: MouseEvent): void => {
        this.removeCurrent();

        const current = e.target as HTMLImageElement;
        current.classList.add(CLASS_NAME.carousel.CURRENT);
        this.frame.setAttribute(ATTR.carousel.SRC, current.getAttribute(ATTR.carousel.SRC));
      });
    });
  }

  private removeCurrent(): void {
    Array.from(this.navItems).forEach((element: HTMLImageElement) => {
      element.classList.remove(CLASS_NAME.carousel.CURRENT);
    });
  }
}
