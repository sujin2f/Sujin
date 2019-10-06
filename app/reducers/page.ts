import {
  REQUEST_PAGE_INIT,
  REQUEST_PAGE_SUCCESS,
  REQUEST_PAGE_FAIL,
} from 'app/constants/redux';

const initialState = {
  entities: {},
  loading: false,
};

function page(state = initialState, action) {
  switch (action.type) {
    case REQUEST_PAGE_INIT: {
      return {
        ...state,
        loading: true,
      };
    }

    case REQUEST_PAGE_SUCCESS: {
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.slug]: action.response.data,
        },
        loading: false,
      };
    }

    case REQUEST_PAGE_FAIL: {
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.slug]: action.code,
        },
        loading: false,
      };
    }

    default: {
      return state;
    }
  }
}

export default page;
