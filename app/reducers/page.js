import {
  REQUEST_PAGE_INIT,
  REQUEST_PAGE_SUCCESS,
  REQUEST_PAGE_FAIL,
} from 'app/actions/page';

import { IS_LOADING, IS_ERROR } from 'app/constants/common';

const initialState = {
  entities: {},
};

function page(state = initialState, action) {
  switch (action.type) {
    case REQUEST_PAGE_INIT: {
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.slug]: IS_LOADING,
        },
      };
    }

    case REQUEST_PAGE_SUCCESS: {
      const data = action.response.data.length === 0 ? IS_ERROR : action.response.data[0];
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.slug]: data,
        },
      };
    }

    case REQUEST_PAGE_FAIL: {
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.slug]: IS_ERROR,
        },
      };
    }

    default: {
      return state;
    }
  }
}

export default page;
