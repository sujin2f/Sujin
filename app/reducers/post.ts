import PostState from 'app/types/states/post';
import PostActions from 'app/types/actions/post';

import {
  REQUEST_POST_INIT,
  REQUEST_POST_SUCCESS,
  REQUEST_POST_FAIL,

  REQUEST_RECENT_POSTS_INIT,
  REQUEST_RECENT_POSTS_SUCCESS,
  REQUEST_RECENT_POSTS_FAIL,
} from 'app/constants/redux';

const initialState: PostState = {
  entities: {},
  recent: undefined,
};

function post(state: PostState = initialState, action: PostActions): PostState {
  switch (action.type) {
    case REQUEST_POST_INIT: {
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.slug]: true,
        },
      };
    }
    case REQUEST_POST_SUCCESS: {
      return {
        ...state,
        entities: {
          ...state.entities,
          [decodeURIComponent(action.post.slug)]: action.post,
        },
      };
    }
    case REQUEST_POST_FAIL: {
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.slug]: false,
        },
      };
    }

    case REQUEST_RECENT_POSTS_INIT: {
      return {
        ...state,
        recent: true,
      };
    }
    case REQUEST_RECENT_POSTS_SUCCESS: {
      return {
        ...state,
        recent: action.posts,
      };
    }
    case REQUEST_RECENT_POSTS_FAIL: {
      return {
        ...state,
        recent: false,
      };
    }

    default: {
      return state;
    }
  }
}

export default post;
