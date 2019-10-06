import PostState from 'app/types/states/post';
import PostActions from 'app/types/actions/post';

import {
  REQUEST_POST_INIT,
  REQUEST_POST_SUCCESS,
  REQUEST_POST_FAIL,

  REQUEST_RECENT_POSTS_INIT,
  REQUEST_RECENT_POSTS_SUCCESS,
  REQUEST_RECENT_POSTS_FAIL,

  REQUEST_ARCHIVE_INIT,
  REQUEST_ARCHIVE_SUCCESS,
  REQUEST_ARCHIVE_FAIL,
} from 'app/constants/redux';

const initialState: PostState = {
  entities: {},
  recent: undefined,
  archive: {
    category: {},
    tag: {},
    search: {},
  },
};

function post(state: PostState = initialState, action: PostActions): PostState {
  switch (action.type) {
    case REQUEST_POST_INIT: {
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.slug]: true,
        },
      };
    }
    case REQUEST_POST_SUCCESS: {
      return {
        ...state,
        entities: {
          ...state.entities,
          [decodeURIComponent(action.post.slug)]: action.post,
        },
      };
    }
    case REQUEST_POST_FAIL: {
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.slug]: false,
        },
      };
    }

    case REQUEST_RECENT_POSTS_INIT: {
      return {
        ...state,
        recent: true,
      };
    }
    case REQUEST_RECENT_POSTS_SUCCESS: {
      return {
        ...state,
        recent: action.posts,
      };
    }
    case REQUEST_RECENT_POSTS_FAIL: {
      return {
        ...state,
        recent: false,
      };
    }

    case REQUEST_ARCHIVE_INIT: {
      const { kind, slug, page } = action;
      const archive = { ...state.archive[kind] };

      if (!archive[slug]) {
        archive[slug] = {
          entities: {
            [page]: true,
          },
        };
      }

      if (!archive[slug].entities[page]) {
        archive[slug].entities[page] = true;
      }

      return {
        ...state,
        archive: {
          ...state.archive,
          [kind]: archive,
        },
      };
    }
    case REQUEST_ARCHIVE_SUCCESS: {
      const { kind, slug, page } = action;
      const entities = { ...state.entities };

      action.posts.forEach((post) => entities[decodeURIComponent(post.slug)] = post);

      return {
        ...state,
        entities,
        archive: {
          ...state.archive,
          [kind]: {
            ...state.archive[kind],
            [slug]: {
              ...state.archive[kind][slug],
              totalPages: action.totalPages,
              background: action.background,
              title: action.title,
              description: action.description,
              entities: {
                ...state.archive[kind][slug].entities,
                [page]: action.posts,
              },
            },
          },
        },
      };
    }
    case REQUEST_ARCHIVE_FAIL: {
      const { kind, slug, page } = action;

      return {
        ...state,
        archive: {
          ...state.archive,
          [kind]: {
            ...state.archive[kind],
            [slug]: {
              ...state.archive[kind][slug],
              entities: {
                ...state.archive[kind][slug].entities,
                [page]: false,
              },
            },
          },
        },
      };
    }

    default: {
      return state;
    }
  }
}

export default post;
