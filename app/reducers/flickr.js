import {
  REQUEST_FLICKR_INIT,
  REQUEST_FLICKR_SUCCESS,
  REQUEST_FLICKR_FAIL,
} from 'app/actions/flickr';

const initialState = {
  entities: [],
  loading: false,
};

function flickr(state = initialState, action) {
  switch (action.type) {
    case REQUEST_FLICKR_INIT: {
      return {
        ...state,
        loading: true,
        entities: [],
      };
    }

    case REQUEST_FLICKR_SUCCESS: {
      return {
        ...state,
        entities: action.response.data,
        loading: false,
      };
    }

    case REQUEST_FLICKR_FAIL: {
      return {
        ...state,
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
