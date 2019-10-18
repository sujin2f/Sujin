import {
  SET_HISTORY,
  SET_LOCATION,
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

// Mobile Menu
export interface SetMobileMenu {
  type: SET_MOBILE_MENU;
  status: string | boolean;
}

type GlobalActions = SetHistory | SetLocation | SetMobileMenu;
export default GlobalActions;
