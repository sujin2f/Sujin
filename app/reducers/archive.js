import {
  REQUEST_ARCHIVE_INIT,
  REQUEST_ARCHIVE_SUCCESS,
  REQUEST_ARCHIVE_FAIL,
} from 'app/actions/archive';

const initialState = {
  entities: {
    category: {},
    tag: {},
    search: {},
  },
  loading: false,
};

function archive(state = initialState, action) {
  switch (action.type) {
    case REQUEST_ARCHIVE_INIT: {
      return {
        ...state,
        loading: true,
      };
    }

    case REQUEST_ARCHIVE_SUCCESS: {
      const { kind, slug, page } = action;
      const totalPages = parseInt(action.response.headers['x-wp-totalpages'], 10);
      const background = action.response.headers['x-wp-term-thumbnail'];
      const title = decodeURIComponent(action.response.headers['x-wp-term-name']);
      const description = decodeURIComponent(action.response.headers['x-wp-term-description']);

      return {
        ...state,
        entities: {
          ...state.entities,
          [kind]: {
            ...state.entities[kind],
            [slug]: {
              ...state.entities[kind][slug],
              totalPages,
              background,
              title,
              description,
              [page]: {
                entities: action.response.data,
              },
            },
          },
        },
        loading: false,
      };
    }

    case REQUEST_ARCHIVE_FAIL: {
      console.log(action);
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.kind]: {
            ...state.entities[action.kind],
            [action.slug]: {
              ...state.entities[action.kind][action.slug],
              [action.page]: action.code,
            },
          },
        },
        loading: false,
      };
    }

    default: {
      return state;
    }
  }
}

export default archive;
