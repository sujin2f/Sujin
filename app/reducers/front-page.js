import {
  GET_MAIN_BACKGROUND_INIT,
  GET_MAIN_BACKGROUND_SUCCESS,
  GET_MAIN_BACKGROUND_FAIL,
} from 'app/actions/front-page';

const initialState = {
  entities: {},
  loading: false,
};

function frontPage(state = initialState, action) {
  switch (action.type) {
    case GET_MAIN_BACKGROUND_INIT: {
      return {
        ...state,
        loading: true,
        entities: {},
      };
    }

    case GET_MAIN_BACKGROUND_SUCCESS: {
      return {
        ...state,
        entities: action.response.data,
        loading: false,
      };
    }

    case GET_MAIN_BACKGROUND_FAIL: {
      return {
        ...state,
        loading: false,
        entities: {},
      };
    }

    default: {
      return state;
    }
  }
}

export default frontPage;
