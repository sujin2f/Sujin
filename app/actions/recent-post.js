import axios from 'app/utils/axios';
import axiosOrigin from 'axios';

export const GET_RECENT_POSTS_INIT = 'sujin/recent-post/GET_RECENT_POSTS_INIT';
export const GET_RECENT_POSTS_SUCCESS = 'sujin/recent-post/GET_RECENT_POSTS_SUCCESS';
export const GET_RECENT_POSTS_FAIL = 'sujin/recent-post/GET_RECENT_POSTS_FAIL';

// Get Recent Posts

function getRecentPostsInit(source) {
  return {
    type: GET_RECENT_POSTS_INIT,
    source,
  };
}
function getRecentPostsSuccess(response) {
  return {
    type: GET_RECENT_POSTS_SUCCESS,
    response,
  };
}
function getRecentPostsFail(error) {
  return {
    type: GET_RECENT_POSTS_FAIL,
    error,
  };
}

export function getRecentPosts(prevToken) {
  if (prevToken) {
    prevToken.cancel('Canceled');
  }

  const cancelToken = axiosOrigin.CancelToken;
  const source = cancelToken.source();

  const params = {
    page: 1,
    per_page: 4,
    category_names: null,
    thumbnail_size: 'recent-post',
  };

  return (dispatch) => {
    dispatch(getRecentPostsInit(source));

    axios.get(
      'wp-json/sujin/v1/posts/',
      { params },
      { cancelToken: source.token },
    ).then((response) => {
      dispatch(getRecentPostsSuccess(response));
    }).catch((error) => {
      dispatch(getRecentPostsFail(error));
    });
  };
}
