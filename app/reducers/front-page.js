import {
  REQUEST_MAIN_BACKGROUND_INIT,
  REQUEST_MAIN_BACKGROUND_SUCCESS,
  REQUEST_MAIN_BACKGROUND_FAIL,
} from 'app/actions/front-page';

const initialState = {
  entities: [],
  loading: false,
  error: false,
};

function frontPage(state = initialState, action) {
  switch (action.type) {
    case REQUEST_MAIN_BACKGROUND_INIT: {
      return {
        ...state,
        loading: true,
        error: false,
      };
    }

    case REQUEST_MAIN_BACKGROUND_SUCCESS: {
      return {
        ...state,
        entities: action.response.data,
        loading: false,
      };
    }

    case REQUEST_MAIN_BACKGROUND_FAIL: {
      return {
        ...state,
        loading: false,
        error: true,
      };
    }

    default: {
      return state;
    }
  }
}

export default frontPage;
