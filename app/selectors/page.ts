import State from 'app/types/states';

/* eslint-disable import/prefer-default-export */
export const getPage = (state: State, slug: string) => state.page[slug];
/* eslint-enable import/prefer-default-export */
