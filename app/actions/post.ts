import Post from 'app/types/rest/post';
import {
  RequestPostInit,
  RequestPostSuccess,
  RequestPostFail,

  RequestRecentPostsInit,
  RequestRecentPostsSuccess,
  RequestRecentPostsFail,
} from 'app/types/actions/post';

import {
  REQUEST_POST_INIT,
  REQUEST_POST_SUCCESS,
  REQUEST_POST_FAIL,

  REQUEST_RECENT_POSTS_INIT,
  REQUEST_RECENT_POSTS_SUCCESS,
  REQUEST_RECENT_POSTS_FAIL,
} from 'app/constants/redux';

// Post
export function requestPostInit(slug: string): RequestPostInit {
  return {
    type: REQUEST_POST_INIT,
    slug,
  };
}
export function requestPostSuccess(post: Post): RequestPostSuccess {
  return {
    type: REQUEST_POST_SUCCESS,
    post,
  };
}
export function requestPostFail(slug: string): RequestPostFail {
  return {
    type: REQUEST_POST_FAIL,
    slug,
  };
}

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
