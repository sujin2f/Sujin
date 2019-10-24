/* eslint-disable import/prefer-default-export */
export enum Types {
  Category = 'category',
  Tag = 'tag',
  Search = 'search',
}

export interface ArchiveMatched {
  type: Types;
  slug: string;
  page: number;
}
/* eslint-enable */
