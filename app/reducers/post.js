import {
  GET_POST_INIT,
  GET_POST_SUCCESS,
  GET_POST_FAIL,

  GET_SERIES_INIT,
  GET_SERIES_SUCCESS,
  GET_SERIES_FAIL,
} from 'app/actions/post';

const initialState = {
  loading: true,
  cancelToken: null,
  series: [],
};

function post(state = initialState, action) {
  switch (action.type) {
    case GET_POST_INIT: {
      return {
        loading: true,
        cancelToken: action.source,
      };
    }

    case GET_POST_SUCCESS: {
      return {
        ...state,
        ...action.response.data,
        series: [],
        loading: false,
      };
    }

    case GET_POST_FAIL: {
      return {
        loading: false,
      };
    }

    case GET_SERIES_INIT: {
      return {
        ...state,
        series: [],
      };
    }

    case GET_SERIES_SUCCESS: {
      return {
        ...state,
        series: action.response.data,
      };
    }

    case GET_SERIES_FAIL: {
      return {
        ...state,
        series: [],
      };
    }

    default: {
      return state;
    }
  }
}

export default post;
