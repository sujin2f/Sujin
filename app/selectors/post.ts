import State from 'app/types/states';

/* eslint-disable import/prefer-default-export */
export const getPost = (state: State, slug: string) => state.post.entities[slug];

export const getRecentPosts = (state: State) => state.post.recent;

export const getArchive = (state: State, kind: string, slug: string, page: number) => ({
  archive:
    state.post.archive[kind] &&
    state.post.archive[kind][slug] &&
    state.post.archive[kind][slug].entities[page],
  totalPages:
    state.post.archive[kind] &&
    state.post.archive[kind][slug] &&
    state.post.archive[kind][slug].totalPages,
  background:
    state.post.archive[kind] &&
    state.post.archive[kind][slug] &&
    state.post.archive[kind][slug].background,
  title:
    state.post.archive[kind] &&
    state.post.archive[kind][slug] &&
    state.post.archive[kind][slug].title,
  description:
    state.post.archive[kind] &&
    state.post.archive[kind][slug] &&
    state.post.archive[kind][slug].description,
});
/* eslint-enable import/prefer-default-export */
