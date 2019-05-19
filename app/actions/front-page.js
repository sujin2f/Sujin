export const GET_MAIN_BACKGROUND_INIT = 'sujin/front-page/GET_MAIN_BACKGROUND_INIT';
export const GET_MAIN_BACKGROUND_SUCCESS = 'sujin/front-page/GET_MAIN_BACKGROUND_SUCCESS';
export const GET_MAIN_BACKGROUND_FAIL = 'sujin/front-page/GET_MAIN_BACKGROUND_FAIL';

export function getMainBackgroundInit() {
  return {
    type: GET_MAIN_BACKGROUND_INIT,
  };
}

export function getMainBackgroundSuccess(response) {
  return {
    type: GET_MAIN_BACKGROUND_SUCCESS,
    response,
  };
}

export function getMainBackgroundFail() {
  return {
    type: GET_MAIN_BACKGROUND_FAIL,
  };
}
