export const SET_MOBILE_MENU = 'sujin/v2/global/SET_MOBILE_MENU';

export const REQUEST_MENU_INIT = 'sujin/v2/global/REQUEST_MENU_INIT';
export const REQUEST_MENU_SUCCESS = 'sujin/v2/global/REQUEST_MENU_SUCCESS';
export const REQUEST_MENU_FAIL = 'sujin/v2/global/REQUEST_MENU_FAIL';

// Mobile Menu
export function setMobileMenu(status) {
  return {
    type: SET_MOBILE_MENU,
    status,
  };
}

// Read WP Menu
export function requestMenuInit(slug) {
  return {
    type: REQUEST_MENU_INIT,
    slug,
  };
}

export function requestMenuSuccess(slug, response) {
  return {
    type: REQUEST_MENU_SUCCESS,
    slug,
    response,
  };
}

export function requestMenuFail(slug, error) {
  return {
    type: REQUEST_MENU_FAIL,
    slug,
    error,
  };
}
