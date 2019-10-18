export default class MatchedItem {
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

export const emptyMatched: MatchedItem = new MatchedItem({});
