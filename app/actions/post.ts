import Post from 'app/types/rest/post';
import {
  RequestRecentPostsInit,
  RequestRecentPostsSuccess,
  RequestRecentPostsFail,
} from 'app/types/actions/post';

import {
  REQUEST_RECENT_POSTS_INIT,
  REQUEST_RECENT_POSTS_SUCCESS,
  REQUEST_RECENT_POSTS_FAIL,
} from 'app/constants/redux';

// Recent Posts
export function requestRecentPostsInit(): RequestRecentPostsInit {
  return {
    type: REQUEST_RECENT_POSTS_INIT,
  };
}
export function requestRecentPostsSuccess(posts: Array<Post>): RequestRecentPostsSuccess {
  return {
    type: REQUEST_RECENT_POSTS_SUCCESS,
    posts,
  };
}
export function requestRecentPostsFail(): RequestRecentPostsFail {
  return {
    type: REQUEST_RECENT_POSTS_FAIL,
  };
}
