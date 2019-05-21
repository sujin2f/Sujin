/* eslint-disable import/prefer-default-export */

export const getPage = (state, slug) => ({
  page: state.page.entities[slug] || false,
  loading: state.page.loading,
});

/* eslint-enable import/prefer-default-export */
