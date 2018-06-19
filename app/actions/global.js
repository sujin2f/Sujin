import axios from 'app/utils/axios';

export const TOGGLE_SCROLL = 'sujin/global/TOGGLE_SCROLL';
export const TOGGLE_MOBILE_MENU = 'sujin/global/TOGGLE_MOBILE_MENU';
export const RESET_MOBILE_MENU = 'sujin/global/RESET_MOBILE_MENU';

export const GET_MENU_INIT = 'sujin/global/GET_MENU_INIT';
export const GET_MENU_SUCCESS = 'sujin/global/GET_MENU_SUCCESS';
export const GET_MENU_FAIL = 'sujin/global/GET_MENU_FAIL';

export function toggleScroll(key) {
  return {
    type: TOGGLE_SCROLL,
    key,
  };
}

export function toggleMobileMenu() {
  return {
    type: TOGGLE_MOBILE_MENU,
  };
}

export function resetMobileMenu() {
  return {
    type: RESET_MOBILE_MENU,
  };
}

function getMenuInit() {
  return {
    type: GET_MENU_INIT,
  };
}

function getMenuSuccess(response) {
  return {
    type: GET_MENU_SUCCESS,
    response,
  };
}

function getMenuFail(error) {
  return {
    type: GET_MENU_FAIL,
    error,
  };
}

export function getMenu() {
  return (dispatch) => {
    dispatch(getMenuInit());

    axios.get('wp-json/sujin/v1/menu')
      .then((response) => {
        dispatch(getMenuSuccess(response));
      }).catch((error) => {
        dispatch(getMenuFail(error));
      });
  };
}
