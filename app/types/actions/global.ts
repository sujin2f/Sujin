import Matched from 'app/types/matched';

import {
  SET_HISTORY,
  SET_MATCHED,
  SET_LOCATION,

  SET_TITLE,
  SET_MOBILE_MENU,
} from 'app/constants/redux';

// History
export interface SetHistory {
  type: SET_HISTORY;
  history: any;
}
export interface SetMatched {
  type: SET_MATCHED;
  matched: Matched;
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

type GlobalActions = SetHistory | SetMatched | SetLocation | SetTitle | SetMobileMenu;
export default GlobalActions;
