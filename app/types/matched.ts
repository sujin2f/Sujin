/* eslint-disable max-classes-per-file */
import pathToRegexp from 'path-to-regexp';

export class MatchedItem {
  readonly matched: boolean;
  readonly slug?: string;
  readonly category?: string;
  readonly tag?: string;
  readonly search?: string;
  readonly year?: number;
  readonly month?: number;
  readonly day?: number;
  readonly page?: number;

  constructor(data) {
    this.matched = data.matched;
    this.slug = data.slug;
    this.category = data.category;
    this.tag = data.tag;
    this.search = data.search;
    this.year = parseInt(data.year, 10);
    this.month = parseInt(data.month, 10);
    this.day = parseInt(data.day, 10);
    this.page = parseInt(data.page, 10);
  }

  hasChanged(matchedItem: MatchedItem): boolean {
    return matchedItem.slug !== this.slug ||
      matchedItem.category !== this.category ||
      matchedItem.tag !== this.tag ||
      matchedItem.search !== this.search ||
      matchedItem.year !== this.year ||
      matchedItem.month !== this.month ||
      matchedItem.day !== this.day ||
      matchedItem.page !== this.page;
  }
}

const emptyMatched: MatchedItem = new MatchedItem({});

export default class MatchedController {
  static instance: MatchedController;

  protected matched: MatchedItem;

  static getInstance(): MatchedController {
    if (!this.instance) {
      this.instance = new MatchedController();
    }
    return this.instance;
  }

  public setMatched(matched?: MatchedItem): void {
    if (matched) {
      this.matched = matched;
    } else {
      this.matched = emptyMatched;
    }
  }

  public getMatched(): MatchedItem {
    return this.matched || emptyMatched;
  }

  static parseMatched(path: string, url: string): MatchedItem {
    const regExp = new RegExp(pathToRegexp(path));
    const matchedResult = regExp.exec(url);
    const pathname = path.split('/')
      .filter((p) => p.charAt(0) === ':')
      .map((p) => p.slice(1).replace(/\?|(\(.+\))/, ''));

    const matched = matchedResult && pathname.reduce((acc, value, index) => ({
      ...acc,
      [value]: matchedResult[index + 1],
    }), { matched: true });

    return new MatchedItem(matched || {});
  }
}
/* eslint-enable max-classes-per-file */
