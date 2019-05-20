export const SET_MOBILE_MENU = 'sujin/v2/global/SET_MOBILE_MENU';

export const GET_MENU_INIT = 'sujin/v2/global/GET_MENU_INIT';
export const GET_MENU_SUCCESS = 'sujin/v2/global/GET_MENU_SUCCESS';
export const GET_MENU_FAIL = 'sujin/v2/global/GET_MENU_FAIL';

// Mobile Menu
export function setMobileMenu(status) {
  return {
    type: SET_MOBILE_MENU,
    status,
  };
}

// Read WP Menu
export function getMenuInit(slug) {
  return {
    type: GET_MENU_INIT,
    slug,
  };
}

export function getMenuSuccess(slug, response) {
  return {
    type: GET_MENU_SUCCESS,
    slug,
    response,
  };
}

export function getMenuFail(slug, error) {
  return {
    type: GET_MENU_FAIL,
    slug,
    error,
  };
}
