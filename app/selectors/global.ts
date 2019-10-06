import { MenuArray } from 'app/types/responses/menu';
import { MainBackgroundArray } from 'app/types/responses/main-background';
import { FlickrArray } from 'app/types/responses/flickr';
import State from 'app/types/states';

/* eslint-disable import/prefer-default-export */
export const getMenu = (state: State, slug: string): MenuArray => state.global.menu[slug];

export const getMobileMenuClass = (state: State): string => state.global.mobileMenu ? 'mobile-menu' : '';

export const getTitle = (state: State): string => state.global.title;

export const getMainBackground = (state: State): MainBackgroundArray => state.global.backgrounds;

export const getFlickr = (state: State): FlickrArray => state.global.flickr;

export const getHistory = (state:State) => state.global.history.history;
export const getMatched = (state:State) => state.global.history.matched;
export const getLocation = (state:State) => state.global.history.location;
/* eslint-enable import/prefer-default-export */
