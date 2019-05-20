export const REQUEST_FLICKR_INIT = 'sujin/flickr/REQUEST_FLICKR_INIT';
export const REQUEST_FLICKR_SUCCESS = 'sujin/flickr/REQUEST_FLICKR_SUCCESS';
export const REQUEST_FLICKR_FAIL = 'sujin/flickr/REQUEST_FLICKR_FAIL';

export function requestFlickrInit() {
  return {
    type: REQUEST_FLICKR_INIT,
  };
}

export function requestFlickrSuccess(response) {
  return {
    type: REQUEST_FLICKR_SUCCESS,
    response,
  };
}

export function requestFlickrFail() {
  return {
    type: REQUEST_FLICKR_FAIL,
  };
}
