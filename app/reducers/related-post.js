import {
  GET_RELATED_POSTS_INIT,
  GET_RELATED_POSTS_SUCCESS,
  GET_RELATED_POSTS_FAIL,
} from 'app/actions/related-post';

const initialState = {
  loading: true,
  entities: [],
  cancelToken: null,
};

function relatedPost(state = initialState, action) {
  switch (action.type) {
    case GET_RELATED_POSTS_INIT: {
      return {
        ...state,
        entities: [],
        loading: true,
        cancelToken: action.source,
      };
    }

    case GET_RELATED_POSTS_SUCCESS: {
      return {
        ...state,
        entities: [...action.response.data],
        loading: false,
      };
    }

    case GET_RELATED_POSTS_FAIL: {
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

export default relatedPost;
