import {
  GET_FLICKR_INIT,
  GET_FLICKR_SUCCESS,
  GET_FLICKR_FAIL,
} from 'app/actions/flickr';

const initialState = {
  entities: [],
  loading: false,
};

function flickr(state = initialState, action) {
  switch (action.type) {
    case GET_FLICKR_INIT: {
      return {
        ...state,
        loading: true,
        entities: [],
      };
    }

    case GET_FLICKR_SUCCESS: {
      return {
        ...state,
        entities: action.response.data,
        loading: false,
      };
    }

    case GET_FLICKR_FAIL: {
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
