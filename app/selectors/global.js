/* eslint-disable import/prefer-default-export */

export const getMenu = (state, slug) => state.global.menu[slug];

export const getMobileMenuClass = (state) => state.global.mobileMenu ? 'mobile-menu' : '';

export const getTitle = (state) => state.global.title;

/* eslint-enable import/prefer-default-export */
