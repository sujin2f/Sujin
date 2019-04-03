export const TOGGLE_SCROLL = 'sujin/v2/global/TOGGLE_SCROLL';
export const TOGGLE_MOBILE_MENU = 'sujin/v2/global/TOGGLE_MOBILE_MENU';
export const RESET_MOBILE_MENU = 'sujin/v2/global/RESET_MOBILE_MENU';

export const GET_MENU_INIT = 'sujin/v2/global/GET_MENU_INIT';
export const GET_MENU_SUCCESS = 'sujin/v2/global/GET_MENU_SUCCESS';
export const GET_MENU_FAIL = 'sujin/v2/global/GET_MENU_FAIL';

// Scroll
export function toggleScroll(key) {
  return {
    type: TOGGLE_SCROLL,
    key,
  };
}

// Mobile Menu
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

// Read Menu
export function getMenuInit() {
  return {
    type: GET_MENU_INIT,
  };
}

export function getMenuSuccess(menuType, response) {
  return {
    type: GET_MENU_SUCCESS,
    menuType,
    response,
  };
}

export function getMenuFail(menuType, error) {
  return {
    type: GET_MENU_FAIL,
    menuType,
    error,
  };
}
