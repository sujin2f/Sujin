export const REQUEST_POST_INIT = 'sujin/post/REQUEST_POST_INIT';
export const REQUEST_POST_SUCCESS = 'sujin/post/REQUEST_POST_SUCCESS';
export const REQUEST_POST_FAIL = 'sujin/post/REQUEST_POST_FAIL';

export function requestPostInit(slug) {
  return {
    type: REQUEST_POST_INIT,
    slug,
  };
}

export function requestPostSuccess(slug, response) {
  return {
    type: REQUEST_POST_SUCCESS,
    slug,
    response,
  };
}

export function requestPostFail(slug) {
  return {
    type: REQUEST_POST_FAIL,
    slug,
  };
}
