import Matched from 'app/types/matched';
import { MenuArray } from 'app/types/rest/menu';
import { MainBackgroundArray } from 'app/types/rest/main-background';
import State from 'app/types/states';

/* eslint-disable import/prefer-default-export */
export const getMenu = (state: State, slug: string): MenuArray => state.global.menu[slug];

export const getMobileMenuClass = (state: State): string => state.global.mobileMenu ? 'mobile-menu' : '';

export const getTitle = (state: State): string => state.global.title;

export const getMainBackground = (state: State): MainBackgroundArray => state.global.backgrounds;

export const getHistory = (state:State) => state.global.history.history;
export const getMatched = (state:State): Matched => state.global.history.matched;
export const getLocation = (state:State) => state.global.history.location;
/* eslint-enable import/prefer-default-export */
