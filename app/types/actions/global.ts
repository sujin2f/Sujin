import {
  SET_HISTORY,
  SET_LOCATION,

  SET_TITLE,
  SET_MOBILE_MENU,
} from 'app/constants/redux';

// History
export interface SetHistory {
  type: SET_HISTORY;
  history: any;
}
export interface SetLocation {
  type: SET_LOCATION;
  location: any;
}

// Set HTML <title /> tag
export interface SetTitle {
  type: SET_TITLE;
  title: string;
}

// Mobile Menu
export interface SetMobileMenu {
  type: SET_MOBILE_MENU;
  status: string | boolean;
}

type GlobalActions = SetHistory | SetLocation | SetTitle | SetMobileMenu;
export default GlobalActions;
