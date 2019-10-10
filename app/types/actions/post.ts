import Post from 'app/types/rest/post';
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
  post: Post;
}

export interface RequestPostFail {
  type: REQUEST_POST_FAIL;
  slug: string;
}

export interface RequestRecentPostsInit {
  type: REQUEST_RECENT_POSTS_INIT;
}

export interface RequestRecentPostsSuccess {
  type: REQUEST_RECENT_POSTS_SUCCESS;
  posts: Array<Post>;
}

export interface RequestRecentPostsFail {
  type: REQUEST_RECENT_POSTS_FAIL;
}

type PostActions = RequestPostInit | RequestPostSuccess | RequestPostFail | RequestRecentPostsInit | RequestRecentPostsSuccess | RequestRecentPostsFail;
export default PostActions;
