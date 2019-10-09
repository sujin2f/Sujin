import Matched from 'app/types/matched';
import State from 'app/types/states';

/* eslint-disable import/prefer-default-export */
export const getMobileMenuClass = (state: State): string => state.global.mobileMenu ? 'mobile-menu' : '';

export const getTitle = (state: State): string => state.global.title;

export const getHistory = (state:State) => state.global.history.history;
export const getMatched = (state:State): Matched => state.global.history.matched;
export const getLocation = (state:State) => state.global.history.location;
/* eslint-enable import/prefer-default-export */
