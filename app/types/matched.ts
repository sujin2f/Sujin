import { Types } from 'app/types/rest/archive';

export default class MatchedItem {
  readonly matched: boolean;
  readonly slug?: string;
  readonly type?: Types;
  readonly page?: number;

  constructor(data) {
    this.matched = data.matched;
    this.slug = data.slug;
    this.type = data.type;
    this.page = data.page ? parseInt(data.page, 10) : 1;
  }

  hasChanged(matchedItem: MatchedItem): boolean {
    return matchedItem.slug !== this.slug ||
      matchedItem.type !== this.type ||
      matchedItem.page !== this.page;
  }
}

export const emptyMatched: MatchedItem = new MatchedItem({});
