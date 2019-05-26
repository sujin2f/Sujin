import {
  REQUEST_POST_INIT,
  REQUEST_POST_SUCCESS,
  REQUEST_POST_FAIL,
  REQUEST_RECENT_POSTS_INIT,
  REQUEST_RECENT_POSTS_SUCCESS,
  REQUEST_RECENT_POSTS_FAIL,
} from 'app/actions/post';

import { IS_ERROR } from 'app/constants/common';

const initialState = {
  entities: {},
  ids: {},
  loading: false,
  recentLoading: false,
};

function post(state = initialState, action) {
  switch (action.type) {
    case REQUEST_POST_INIT: {
      return {
        ...state,
        loading: true,
      };
    }

    case REQUEST_POST_SUCCESS: {
      const data = Object.keys(action.response.data) === 0 ? IS_ERROR : action.response.data;

      const unorderId = { ...state.ids };
      unorderId[data.id] = action.slug;

      const ids = {};
      Object.keys(unorderId).sort().forEach((key) => {
        ids[key] = unorderId[key];
      });

      return {
        ...state,
        entities: {
          ...state.entities,
          [action.slug]: data,
        },
        ids,
        loading: false,
      };
    }

    case REQUEST_POST_FAIL: {
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.slug]: IS_ERROR,
        },
        loading: false,
      };
    }

    case REQUEST_RECENT_POSTS_INIT: {
      return {
        ...state,
        recentLoading: true,
      };
    }

    case REQUEST_RECENT_POSTS_SUCCESS: {
      const response = action.response.data.reduce((acc, value) => ({
        ...acc,
        [value.slug]: value,
      }), {});

      const unorderId = action.response.data.reduce((acc, value) => ({
        ...acc,
        [value.id]: value.slug,
      }), { ...state.ids });

      const ids = {};
      Object.keys(unorderId).sort().forEach((key) => {
        ids[key] = unorderId[key];
      });

      return {
        ...state,
        entities: {
          ...state.entities,
          ...response,
        },
        ids,
        recentLoading: false,
      };
    }

    case REQUEST_RECENT_POSTS_FAIL: {
      return {
        ...state,
        recentLoading: false,
      };
    }

    default: {
      return state;
    }
  }
}

export default post;
