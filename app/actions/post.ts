import Post from 'app/types/responses/post';
import {
  RequestPostInit,
  RequestPostSuccess,
  RequestPostFail,

  RequestRecentPostsInit,
  RequestRecentPostsSuccess,
  RequestRecentPostsFail,

  RequestArchiveInit,
  RequestArchiveSuccess,
  RequestArchiveFail,
} from 'app/types/actions/post';

import {
  REQUEST_POST_INIT,
  REQUEST_POST_SUCCESS,
  REQUEST_POST_FAIL,

  REQUEST_RECENT_POSTS_INIT,
  REQUEST_RECENT_POSTS_SUCCESS,
  REQUEST_RECENT_POSTS_FAIL,

  REQUEST_ARCHIVE_INIT,
  REQUEST_ARCHIVE_SUCCESS,
  REQUEST_ARCHIVE_FAIL,
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

// Archive
export function requestArchiveInit(page: number, kind: string, slug: string): RequestArchiveInit {
  return {
    type: REQUEST_ARCHIVE_INIT,
    kind,
    slug,
    page,
  };
}

export function requestArchiveSuccess(page: number, kind: string, slug: string, header: any, posts: Array<Post>): RequestArchiveSuccess {
  const totalPages = parseInt(header['x-wp-totalpages'], 10);
  const background = header['x-wp-term-thumbnail'];
  const title = decodeURIComponent(header['x-wp-term-name']);
  const description = decodeURIComponent(header['x-wp-term-description']);

  return {
    type: REQUEST_ARCHIVE_SUCCESS,
    kind,
    slug,
    page,
    totalPages,
    background,
    title,
    description,
    posts,
  };
}

export function requestArchiveFail(page: number, kind: string, slug: string): RequestArchiveFail {
  return {
    type: REQUEST_ARCHIVE_FAIL,
    kind,
    slug,
    page,
  };
}
