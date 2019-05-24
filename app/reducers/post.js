import {
  REQUEST_POST_INIT,
  REQUEST_POST_SUCCESS,
  REQUEST_POST_FAIL,
} from 'app/actions/post';

import { IS_ERROR } from 'app/constants/common';

const initialState = {
  entities: {},
  loading: false,
};

function post(state = initialState, action) {
  switch (action.type) {
    case REQUEST_POST_INIT: {
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.slug]: {},
        },
        loading: true,
      };
    }

    case REQUEST_POST_SUCCESS: {
      const data = Object.keys(action.response.data) === 0 ? IS_ERROR : action.response.data;
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.slug]: data,
        },
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

    default: {
      return state;
    }
  }
}

export default post;
