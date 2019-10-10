import State from 'app/types/states';

/* eslint-disable import/prefer-default-export */
export const getPost = (state: State, slug: string) => state.post.entities[slug];

export const getRecentPosts = (state: State) => state.post.recent;
/* eslint-enable import/prefer-default-export */
