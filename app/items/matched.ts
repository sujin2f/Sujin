import { TermTypes } from 'app/constants/enum';

export interface IMatchedItem {
  readonly matched: boolean;
  readonly slug?: string;
  readonly type?: TermTypes;
  readonly page?: number;
}

export default class MatchedItem {
  readonly matched: boolean;
  readonly slug?: string;
  readonly type?: TermTypes;
  readonly page?: number;

  constructor(data) {
    this.matched = data.matched;
    this.slug = data.slug;
    this.type = data.type;
    this.page = data.page ? parseInt(data.page, 10) : 1;
  }

  hasChanged(matchedItem: IMatchedItem): boolean {
    return matchedItem.slug !== this.slug ||
      matchedItem.type !== this.type ||
      matchedItem.page !== this.page;
  }
}

export const emptyMatched: IMatchedItem = new MatchedItem({});
