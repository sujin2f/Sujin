/* eslint-disable import/prefer-default-export */

export const getMenu = (state, slug) => state.global.menu[slug];

export const getMobileMenuClass = (state) => state.global.mobileMenu ? 'mobile-menu' : '';

/* eslint-enable import/prefer-default-export */
