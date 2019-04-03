export const GET_FLICKR_INIT = 'sujin/flickr/GET_FLICKR_INIT';
export const GET_FLICKR_SUCCESS = 'sujin/flickr/GET_FLICKR_SUCCESS';
export const GET_FLICKR_FAIL = 'sujin/flickr/GET_FLICKR_FAIL';

export function getFlickrInit() {
  return {
    type: GET_FLICKR_INIT,
  };
}

export function getFlickrSuccess(response) {
  return {
    type: GET_FLICKR_SUCCESS,
    response,
  };
}

export function getFlickrFail() {
  return {
    type: GET_FLICKR_FAIL,
  };
}
