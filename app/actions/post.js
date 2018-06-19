import axios from 'app/utils/axios';
import axiosOrigin from 'axios';
import { scrollTo } from 'app/utils/common';

export const GET_POST_INIT = 'sujin/single/GET_POST_INIT';
export const GET_POST_SUCCESS = 'sujin/single/GET_POST_SUCCESS';
export const GET_POST_FAIL = 'sujin/single/GET_POST_FAIL';

export const GET_SERIES_INIT = 'sujin/single/GET_SERIES_INIT';
export const GET_SERIES_SUCCESS = 'sujin/single/GET_SERIES_SUCCESS';
export const GET_SERIES_FAIL = 'sujin/single/GET_SERIES_FAIL';

// Get Post

function getPostInit(source) {
  return {
    type: GET_POST_INIT,
    source,
  };
}
export function getPostSuccess(response) {
  return {
    type: GET_POST_SUCCESS,
    response,
  };
}
export function getPostFail(error) {
  return {
    type: GET_POST_FAIL,
    error,
  };
}

export function getPostServer(postSlug, source) {
  const cancelToken = source ? { cancelToken: source.token } : {};

  return axios.get(
    'wp-json/sujin/v1/post/',
    { params: { post_slug: postSlug } },
    { ...cancelToken },
  );
}

function getSeriesInit() {
  return {
    type: GET_SERIES_INIT,
  };
}
function getSeriesSuccess(response) {
  return {
    type: GET_SERIES_SUCCESS,
    response,
  };
}
function getSeriesFail(error) {
  return {
    type: GET_SERIES_FAIL,
    error,
  };
}

function getSeries(id) {
  return (dispatch) => {
    dispatch(getSeriesInit());

    axios.get(`wp-json/wp/v2/posts/?series=${id}&per_page=100`)
      .then((response) => {
        dispatch(getSeriesSuccess(response));
      })
      .catch((error) => {
        dispatch(getSeriesFail(error));
      });
  };
}

export function getPost(postSlug, push, prevToken) {
  if (prevToken) {
    prevToken.cancel('Canceled');
  }

  const cancelToken = axiosOrigin.CancelToken;
  const source = cancelToken.source();

  return (dispatch) => {
    scrollTo();
    dispatch(getPostInit(source));

    getPostServer(postSlug, source)
      .then((response) => {
        if (response.data.series.length > 0) {
          dispatch(getSeries(response.data.series[0]));
        }
        dispatch(getPostSuccess(response));
      })
      .catch((error) => {
        dispatch(getPostFail(error));
        dispatch(push(`${process.env.SUJIN_BASE_URL}404`));
      });
  };
}
