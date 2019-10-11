import Post from 'app/types/rest/post';
import {
  REQUEST_RECENT_POSTS_INIT,
  REQUEST_RECENT_POSTS_SUCCESS,
  REQUEST_RECENT_POSTS_FAIL,
} from 'app/constants/redux';

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

type PostActions = RequestRecentPostsInit | RequestRecentPostsSuccess | RequestRecentPostsFail;
export default PostActions;
