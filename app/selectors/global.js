/* eslint-disable import/prefer-default-export */

export const getMenu = (state, type) => state.global.menu[type] || [];

export const getMobileMenuActivated = (state) => state.global.mobileMenu;

/* eslint-enable import/prefer-default-export */
