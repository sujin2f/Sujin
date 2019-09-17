import {
  REQUEST_FLICKR_INIT,
  REQUEST_FLICKR_SUCCESS,
  REQUEST_FLICKR_FAIL,
} from 'app/actions/flickr';

export const initialState = {
  error: false,
  loading: false,
  entities: [],
};

function flickr(state = initialState, action) {
  switch (action.type) {
    case REQUEST_FLICKR_INIT: {
      return {
        ...state,
        error: false,
        loading: true,
        entities: [],
      };
    }

    case REQUEST_FLICKR_SUCCESS: {
      return {
        ...state,
        error: false,
        loading: false,
        entities: action.response.data,
      };
    }

    case REQUEST_FLICKR_FAIL: {
      console.log(1);
      return {
        ...state,
        error: true,
        loading: false,
        entities: [],
      };
    }

    default: {
      return state;
    }
  }
}

export default flickr;
