/** app/items/rest/term */

import { ITerm } from 'app/items/rest/interface/term';

export default class Term implements ITerm {
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
