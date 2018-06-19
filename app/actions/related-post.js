import axios from 'app/utils/axios';
import axiosOrigin from 'axios';

export const GET_RELATED_POSTS_INIT = 'sujin/related-post/GET_RELATED_POSTS_INIT';
export const GET_RELATED_POSTS_SUCCESS = 'sujin/related-post/GET_RELATED_POSTS_SUCCESS';
export const GET_RELATED_POSTS_FAIL = 'sujin/related-post/GET_RELATED_POSTS_FAIL';

// Get Related Posts

function getRelatedPostsInit(source) {
  return {
    type: GET_RELATED_POSTS_INIT,
    source,
  };
}
function getRelatedPostsSuccess(response) {
  return {
    type: GET_RELATED_POSTS_SUCCESS,
    response,
  };
}
function getRelatedPostsFail(error) {
  return {
    type: GET_RELATED_POSTS_FAIL,
    error,
  };
}

export function getRelatedPosts(postId, prevToken) {
  if (prevToken) {
    prevToken.cancel('Canceled');
  }

  const cancelToken = axiosOrigin.CancelToken;
  const source = cancelToken.source();

  return (dispatch) => {
    dispatch(getRelatedPostsInit(source));

    axios.get(`wp-json/sujin/v1/posts/related/${postId}`, {}, { cancelToken: source.token })
      .then((response) => {
        dispatch(getRelatedPostsSuccess(response));
      }).catch((error) => {
        dispatch(getRelatedPostsFail(error));
      });
  };
}
