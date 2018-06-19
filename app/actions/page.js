import axios from 'app/utils/axios';
import axiosOrigin from 'axios';
import { scrollTo } from 'app/utils/common';

export const GET_PAGE_INIT = 'sujin/page/GET_PAGE_INIT';
export const GET_PAGE_SUCCESS = 'sujin/page/GET_PAGE_SUCCESS';
export const GET_PAGE_FAIL = 'sujin/page/GET_PAGE_FAIL';

// Get Post
function getPageInit(source) {
  return {
    type: GET_PAGE_INIT,
    source,
  };
}
export function getPageSuccess(response) {
  return {
    type: GET_PAGE_SUCCESS,
    response,
  };
}
export function getPageFail(error) {
  return {
    type: GET_PAGE_FAIL,
    error,
  };
}

export function getPageServer(pageSlug, source) {
  const cancelToken = source ? { cancelToken: source.token } : {};

  return axios.get(
    'wp-json/wp/v2/pages/',
    { params: { slug: pageSlug } },
    { ...cancelToken },
  );
}

export function getPage(pageSlug, push, prevToken) {
  if (prevToken) {
    prevToken.cancel('Canceled');
  }

  const cancelToken = axiosOrigin.CancelToken;
  const source = cancelToken.source();

  return (dispatch) => {
    scrollTo();
    dispatch(getPageInit(source));

    getPageServer(pageSlug, source)
      .then((response) => {
        dispatch(getPageSuccess(response));
      })
      .catch((error) => {
        dispatch(getPageFail(error));
        dispatch(push(`${process.env.SUJIN_BASE_URL}404`));
      });
  };
} // Cool
