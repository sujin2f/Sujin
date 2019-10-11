import PostState from 'app/types/states/post';
import PostActions from 'app/types/actions/post';

import {
  REQUEST_RECENT_POSTS_INIT,
  REQUEST_RECENT_POSTS_SUCCESS,
  REQUEST_RECENT_POSTS_FAIL,
} from 'app/constants/redux';

const initialState: PostState = {
  recent: undefined,
};

function post(state: PostState = initialState, action: PostActions): PostState {
  switch (action.type) {
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
