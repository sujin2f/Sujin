import {
  REQUEST_ARCHIVE_INIT,
  REQUEST_ARCHIVE_SUCCESS,
  REQUEST_ARCHIVE_FAIL,
} from 'app/actions/archive';

import { IS_ERROR } from 'app/constants/common';

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
      const totalPages = parseInt(action.response.headers['x-wp-totalpages'], 10);
      const background = action.response.headers['x-wp-term-thumbnail'];

      const title =
        action.kind === 'search' ?
          action.slug :
          decodeURIComponent(action.response.headers['x-wp-term-name']);
      const description =
        action.kind === 'search' ?
          '' :
          decodeURIComponent(action.response.headers['x-wp-term-description']);

      const entities =
        action.response.data.length > 0 ?
          action.response.data :
          IS_ERROR;

      return {
        ...state,
        entities: {
          ...state.entities,
          [action.kind]: {
            ...state.entities[action.kind],
            [action.slug]: {
              totalPages,
              background,
              title,
              description,
              ...state.entities[action.kind][action.slug],
              [action.page]: {
                entities,
              },
            },
          },
        },
        loading: false,
      };
    }

    case REQUEST_ARCHIVE_FAIL: {
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.kind]: {
            ...state.entities[action.kind],
            [action.slug]: {
              ...state.entities[action.kind][action.slug],
              [action.page]: IS_ERROR,
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
