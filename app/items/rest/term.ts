export default class Term {
  readonly id: number;
  readonly name: string;
  readonly slug: string;

  constructor(data) {
    this.id = data.term_id;
    this.name = data.name;
    this.slug = data.slug;
  }
}
