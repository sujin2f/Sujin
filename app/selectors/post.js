/* eslint-disable import/prefer-default-export */

export const getPost = (state, slug) => ({
  post: state.post.entities[slug] || false,
  loading: state.post.loading,
});

/* eslint-enable import/prefer-default-export */
