import State from 'app/types/states';

/* eslint-disable */
export const getMobileMenuClass = (state: State): string => {
  const mobileMenu = state.global.mobileMenu ? 'mobile-menu' : '';
  return mobileMenu;
};

export const getHistory = (state: State): { [key: string]: any } => state.global.history.history;
export const getLocation = (state: State): { [key: string]: any } => state.global.history.location;
/* eslint-enable */
