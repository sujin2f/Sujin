import axios from 'app/utils/axios';
import axiosOrigin from 'axios';

import PAGING from 'app/constants/paging';
import { scrollTo } from 'app/utils/common';

export const GET_POSTS_INIT = 'sujin/archive/GET_POSTS_INIT';
export const GET_POSTS_SUCCESS = 'sujin/archive/GET_POSTS_SUCCESS';
export const GET_POSTS_FAIL = 'sujin/archive/GET_POSTS_FAIL';

// Get Posts
function getPostsInit(source) {
  return {
    type: GET_POSTS_INIT,
    source,
  };
}
export function getPostsSuccess(response) {
  return {
    type: GET_POSTS_SUCCESS,
    response,
  };
}
export function getPostsFail(error) {
  return {
    type: GET_POSTS_FAIL,
    error,
  };
}

export function getServerPosts(queryVars, source) {
  const params = {
    per_page: PAGING.postsPerPage,
    category_names: queryVars.category || null,
    tag_names: queryVars.tag || null,
    search: queryVars.searchString || null,
    page: queryVars.paged || 1,
  };

  const cancelToken = source ? { cancelToken: source.token } : {};

  return axios.get(
    'wp-json/sujin/v1/posts/',
    { params },
    { ...cancelToken },
  );
}

export function getPosts(queryVars, push, prevToken) {
  if (prevToken) {
    prevToken.cancel('Canceled');
  }

  const cancelToken = axiosOrigin.CancelToken;
  const source = cancelToken.source();

  return (dispatch) => {
    scrollTo();
    dispatch(getPostsInit(source));

    getServerPosts(queryVars, source)
      .then((response) => {
        dispatch(getPostsSuccess(response));
      }).catch((error) => {
        dispatch(getPostsFail(error));
        dispatch(push(`${process.env.SUJIN_BASE_URL}404`));
      });
  };
}
