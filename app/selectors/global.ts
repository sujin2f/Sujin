import State from 'app/types/states';

/* eslint-disable import/prefer-default-export */
export const getMobileMenuClass = (state: State): string => {
    return state.global.mobileMenu ? 'mobile-menu' : '';
  };

export const getTitle = (state: State): string => state.global.title;

export const getHistory = (state: State): { [key: string]: any } => state.global.history.history;
export const getLocation = (state: State): { [key: string]: any } => state.global.history.location;
/* eslint-enable import/prefer-default-export */
