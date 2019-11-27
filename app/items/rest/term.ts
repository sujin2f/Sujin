import RestItem from 'app/items/rest/index.d';
import { Term as ITerm } from 'app/items/rest/term.d';

export default class Term implements RestItem, ITerm {
  /**
   * Term name
   */
  name: string;
  /**
   * Term slug
   */
  slug: string;
  /**
   * Term ID
   */
  termId: number;

  constructor(data) {
    this.termId = data.termId;
    this.name = data.name;
    this.slug = data.slug;
  }
}
