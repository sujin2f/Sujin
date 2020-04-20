/** store/items/term */

import { Term as TermType } from 'store/items/schema/term';

export class Term implements TermType {
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

  constructor(data: any) {
    this.name = data.name;
    this.slug = data.slug;
    this.termId = data.termId;
  }
}
