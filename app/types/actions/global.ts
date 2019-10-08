import Matched from 'app/types/matched';
import Menu from 'app/types/rest/menu';
import MainBackground from 'app/types/rest/main-background';
import {
  SET_HISTORY,
  SET_MATCHED,
  SET_LOCATION,

  SET_TITLE,
  SET_MOBILE_MENU,

  REQUEST_MENU_INIT,
  REQUEST_MENU_SUCCESS,
  REQUEST_MENU_FAIL,

  REQUEST_MAIN_BACKGROUND_INIT,
  REQUEST_MAIN_BACKGROUND_SUCCESS,
  REQUEST_MAIN_BACKGROUND_FAIL,
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

// Request WP Menu
export interface RequestMenuInit {
  type: REQUEST_MENU_INIT;
  slug: string;
}
export interface RequestMenuSuccess {
  type: REQUEST_MENU_SUCCESS;
  slug: string;
  menuArray: Array<Menu>;
}
export interface RequestMenuFail {
  type: REQUEST_MENU_FAIL;
  slug: string;
  error: any;
}

// Request background images
export interface RequestMainBackgroundInit {
  type: REQUEST_MAIN_BACKGROUND_INIT;
}
export interface RequestMainBackgroundSuccess {
  type: REQUEST_MAIN_BACKGROUND_SUCCESS;
  backgrounds: Array<MainBackground>;
}
export interface RequestMainBackgroundFail {
  type: REQUEST_MAIN_BACKGROUND_FAIL;
}

type GlobalActions = SetHistory | SetMatched | SetLocation | SetTitle | SetMobileMenu | RequestMenuInit | RequestMenuSuccess | RequestMenuFail | RequestMainBackgroundInit | RequestMainBackgroundSuccess | RequestMainBackgroundFail;
export default GlobalActions;
