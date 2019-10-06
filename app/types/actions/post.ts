import {
  REQUEST_POST_INIT,
  REQUEST_POST_SUCCESS,
  REQUEST_POST_FAIL,
  REQUEST_RECENT_POSTS_INIT,
  REQUEST_RECENT_POSTS_SUCCESS,
  REQUEST_RECENT_POSTS_FAIL,
} from 'app/constants/redux';

export interface RequestPostInit {
  type: REQUEST_POST_INIT;
  slug: string;
}

export interface RequestPostSuccess {
  type: REQUEST_POST_SUCCESS;
  slug: string;
  response: any;
}

export interface RequestPostFail {
  type: REQUEST_POST_FAIL;
  code: string;
  slug: string;
}

export interface RequestRecentPostsInit {
  type: REQUEST_RECENT_POSTS_INIT;
}

export interface RequestRecentPostsSuccess {
  type: REQUEST_RECENT_POSTS_SUCCESS;
  response: any;
}

export interface RequestRecentPostsFail {
  type: REQUEST_RECENT_POSTS_FAIL;
}
