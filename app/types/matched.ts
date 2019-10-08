export default class Matched {
  readonly matched: boolean;
  readonly slug?: string;
  readonly category?: string;
  readonly tag?: string;
  readonly search?: string;
  readonly year?: number;
  readonly month?: number;
  readonly day?: number;
  readonly page?: number;

  constructor(data: any) {
    this.matched = data.matched ? true : false;
    this.slug = data.slug;
    this.category = data.category;
    this.tag = data.tag;
    this.search = data.search;
    this.year = parseInt(data.year, 10);
    this.month = parseInt(data.month, 10);
    this.day = parseInt(data.day, 10);
    this.page = parseInt(data.page, 10);
  }
}
