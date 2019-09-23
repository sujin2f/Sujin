export const SET_MOBILE_MENU = 'sujin/v2/global/SET_MOBILE_MENU';
export const SET_TITLE = 'sujin/v2/global/SET_TITLE';

export const REQUEST_MENU_INIT = 'sujin/v2/global/REQUEST_MENU_INIT';
export const REQUEST_MENU_SUCCESS = 'sujin/v2/global/REQUEST_MENU_SUCCESS';
export const REQUEST_MENU_FAIL = 'sujin/v2/global/REQUEST_MENU_FAIL';

// Set title
export function setTitle(title) {
  return {
    type: SET_TITLE,
    title,
  };
}

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
