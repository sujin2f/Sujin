export const REQUEST_PAGE_INIT = 'sujin/page/REQUEST_PAGE_INIT';
export const REQUEST_PAGE_SUCCESS = 'sujin/page/REQUEST_PAGE_SUCCESS';
export const REQUEST_PAGE_FAIL = 'sujin/page/REQUEST_PAGE_FAIL';

export function requestPageInit(slug) {
  return {
    type: REQUEST_PAGE_INIT,
    slug,
  };
}

export function requestPageSuccess(slug, response) {
  return {
    type: REQUEST_PAGE_SUCCESS,
    slug,
    response,
  };
}

export function requestPageFail(slug) {
  return {
    type: REQUEST_PAGE_FAIL,
    slug,
  };
}
