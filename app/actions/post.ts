import {
  REQUEST_POST_INIT,
  REQUEST_POST_SUCCESS,
  REQUEST_POST_FAIL,
  REQUEST_RECENT_POSTS_INIT,
  REQUEST_RECENT_POSTS_SUCCESS,
  REQUEST_RECENT_POSTS_FAIL,
} from 'app/constants/redux';

import {
  RequestPostInit,
  RequestPostSuccess,
  RequestPostFail,
  RequestRecentPostsInit,
  RequestRecentPostsSuccess,
  RequestRecentPostsFail,
} from 'app/types/actions/post';

// Post
export function requestPostInit(slug: string): RequestPostInit {
  return {
    type: REQUEST_POST_INIT,
    slug,
  };
}

export function requestPostSuccess(slug: string, response: any): RequestPostSuccess {
  return {
    type: REQUEST_POST_SUCCESS,
    slug,
    response,
  };
}

export function requestPostFail(code: string, slug: string): RequestPostFail {
  return {
    type: REQUEST_POST_FAIL,
    code,
    slug,
  };
}

// Recent Posts
export function requestRecentPostsInit(): RequestRecentPostsInit {
  return {
    type: REQUEST_RECENT_POSTS_INIT,
  };
}

export function requestRecentPostsSuccess(response: any): RequestRecentPostsSuccess {
  return {
    type: REQUEST_RECENT_POSTS_SUCCESS,
    response,
  };
}

export function requestRecentPostsFail(): RequestRecentPostsFail {
  return {
    type: REQUEST_RECENT_POSTS_FAIL,
  };
}
