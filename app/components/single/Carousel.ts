import { ATTR, CLASS_NAME, TAG_NAME } from 'app/constants/dom';

export class Carousel {
  private frame: HTMLImageElement;
  private navItems: HTMLCollection;
  private next: HTMLButtonElement;
  private prev: HTMLButtonElement;
  private indicator: HTMLElement;

  public constructor(element: HTMLElement) {
    // Nav Images
    const nav = element.getElementsByTagName(TAG_NAME.NAV);
    this.navItems = nav.item(0).getElementsByTagName(TAG_NAME.IMAGE);

    // Frame
    this.frame = element.querySelector(`.${CLASS_NAME.carousel.PICTURE_FRAME} ${TAG_NAME.IMAGE}`) as HTMLImageElement;

    // Buttons
    this.prev = element.getElementsByClassName(CLASS_NAME.carousel.PREV).item(0) as HTMLButtonElement;
    this.next = element.getElementsByClassName(CLASS_NAME.carousel.NEXT).item(0) as HTMLButtonElement;

    this.indicator = element.getElementsByClassName(CLASS_NAME.carousel.INDICATOR).item(0) as HTMLElement;

    this.bindEvents();
  }

  private bindEvents(): void {
    Array.from(this.navItems).forEach((element: HTMLImageElement) => {
      element.addEventListener('click', (e: MouseEvent): void => {
        const current = e.target as HTMLImageElement;
        this.setCurrentImage(current);
      });
    });

    this.prev.addEventListener('click', (e: MouseEvent): void => {
      e.preventDefault();
      let prev = this.getCurrentImage().previousElementSibling;
      if (!prev) {
        prev = this.navItems[this.navItems.length - 1];
      }
      this.setCurrentImage(prev as HTMLImageElement);
    });

    this.next.addEventListener('click', (e: MouseEvent): void => {
      e.preventDefault();
      let next = this.getCurrentImage().nextElementSibling;
      if (!next) {
        next = this.navItems[0]; // eslint-disable-line prefer-destructuring
      }
      this.setCurrentImage(next as HTMLImageElement);
    });
  }

  private getCurrentImage(): HTMLImageElement {
    const images = Array.from(this.navItems).filter(
      (element: HTMLImageElement) => element.classList.contains(CLASS_NAME.carousel.CURRENT),
    );
    return images.pop() as HTMLImageElement;
  }

  private setCurrentImage(image: HTMLImageElement): void {
    Array.from(this.navItems).forEach((element: HTMLImageElement) => {
      element.classList.remove(CLASS_NAME.carousel.CURRENT);
    });

    image.classList.add(CLASS_NAME.carousel.CURRENT);
    this.frame.setAttribute(ATTR.carousel.SRC, image.getAttribute(ATTR.carousel.SRC));

    const currentId = Array.from(this.navItems).indexOf(image) + 1;
    this.indicator.innerHTML = `${currentId}/${this.navItems.length}`;
  }
}
