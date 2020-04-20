import { ATTR, CLASS_NAME, TAG_NAME } from 'constants/dom';

export class Carousel {
  private available = false;

  private _frame?: HTMLImageElement;
  private _navItems?: HTMLImageElement[];

  private _next?: HTMLButtonElement;
  private _prev?: HTMLButtonElement;
  private _indicator?: HTMLElement;

  public constructor(element: Element) {
    // Nav Images
    const nav: HTMLCollectionOf<Element> = element.getElementsByTagName(TAG_NAME.NAV);
    if (nav.length === 0) {
      return;
    }
    this.available = true;

    const navItems = (nav.item(0) as Element).getElementsByTagName(TAG_NAME.IMAGE);
    this._navItems = Array.from(navItems).map((navItem) => navItem as HTMLImageElement);

    // Frame
    this._frame = element.querySelector(`.${CLASS_NAME.carousel.PICTURE_FRAME} ${TAG_NAME.IMAGE}`) as HTMLImageElement;

    // Buttons
    this._prev = element.getElementsByClassName(CLASS_NAME.carousel.PREV).item(0) as HTMLButtonElement;
    this._next = element.getElementsByClassName(CLASS_NAME.carousel.NEXT).item(0) as HTMLButtonElement;

    this._indicator = element.getElementsByClassName(CLASS_NAME.carousel.INDICATOR).item(0) as HTMLElement;

    this.bindEvents();
  }

  get frame(): HTMLImageElement {
    return this._frame as HTMLImageElement;
  }

  get navItems(): HTMLImageElement[] {
    return this._navItems || [];
  }

  get prev(): HTMLButtonElement {
    return this._prev as HTMLButtonElement;
  }

  get next(): HTMLButtonElement {
    return this._next as HTMLButtonElement;
  }

  get indicator(): HTMLElement {
    return this._indicator as HTMLElement;
  }

  private bindEvents(): void {
    this.navItems.forEach((element: HTMLImageElement) => {
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
    this.frame.setAttribute(ATTR.carousel.SRC, image.getAttribute(ATTR.carousel.SRC) || '');

    const currentId = Array.from(this.navItems).indexOf(image) + 1;
    this.indicator.innerHTML = `${currentId}/${this.navItems.length}`;
  }
}
