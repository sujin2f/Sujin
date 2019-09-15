/* eslint-disable import/prefer-default-export */

export const getPost = (state, slug) => ({
  post: state.post.entities[slug] || false,
  loading: state.post.loading,
});

export const getRecentPosts = (state) => ({
  entities: state.post.recent,
  loading: state.post.recentLoading,
});

/* eslint-enable import/prefer-default-export */
