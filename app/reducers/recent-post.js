import {
  GET_RECENT_POSTS_INIT,
  GET_RECENT_POSTS_SUCCESS,
  GET_RECENT_POSTS_FAIL,
} from 'app/actions/recent-post';

const initialState = {
  loading: true,
  entities: [],
  cancelToken: null,
};

function recentPost(state = initialState, action) {
  switch (action.type) {
    case GET_RECENT_POSTS_INIT: {
      return {
        ...state,
        entities: [],
        loading: true,
        cancelToken: action.source,
      };
    }

    case GET_RECENT_POSTS_SUCCESS: {
      return {
        ...state,
        entities: [...action.response.data],
        loading: false,
      };
    }

    case GET_RECENT_POSTS_FAIL: {
      return {
        ...state,
        entities: [],
        loading: false,
      };
    }

    default: {
      return state;
    }
  }
}

export default recentPost;
