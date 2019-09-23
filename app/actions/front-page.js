export const REQUEST_MAIN_BACKGROUND_INIT = 'sujin/front-page/REQUEST_MAIN_BACKGROUND_INIT';
export const REQUEST_MAIN_BACKGROUND_SUCCESS = 'sujin/front-page/REQUEST_MAIN_BACKGROUND_SUCCESS';
export const REQUEST_MAIN_BACKGROUND_FAIL = 'sujin/front-page/REQUEST_MAIN_BACKGROUND_FAIL';

export function requestMainBackgroundInit() {
  return {
    type: REQUEST_MAIN_BACKGROUND_INIT,
  };
}

export function requestMainBackgroundFail() {
  return {
    type: REQUEST_MAIN_BACKGROUND_FAIL,
  };
}

export function requestMainBackgroundSuccess(response) {
  if (response.status === 204) {
    return requestMainBackgroundFail();
  }

  return {
    type: REQUEST_MAIN_BACKGROUND_SUCCESS,
    response,
  };
}
