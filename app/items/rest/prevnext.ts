export default class PrevNext {
  readonly id: number;
  readonly link: string;
  readonly title: string;
  readonly slug: string;

  constructor(data) {
    this.id = data.id;
    this.link = data.link;
    this.title = decodeURIComponent(data.title);
    this.slug = data.slug;
  }
}
