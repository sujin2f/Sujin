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
      const slugObject =
        (
          state.entities[action.kind] &&
          state.entities[action.kind][action.slug]
        ) ||
        {};
      console.log(slugObject);
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.kind]: {
            ...state.entities[action.kind],
            [action.slug]: {
              ...slugObject,
              [action.page]: [],
            },
          },
        },
        loading: true,
      };
    }

    case REQUEST_ARCHIVE_SUCCESS: {
      const data = action.response.data.length === 0 ? IS_ERROR : action.response.data;
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.kind]: {
            ...state.entities[action.kind],
            [action.slug]: {
              ...state.entities[action.kind][action.slug],
              [action.page]: data,
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
