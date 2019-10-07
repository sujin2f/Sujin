// Types
import Matched from 'app/types/matched';
import Menu from 'app/types/responses/menu';
import MainBackground from 'app/types/responses/main-background';
import Flickr from 'app/types/responses/flickr';
import {
  SetHistory,
  SetMatched,
  SetLocation,

  SetTitle,
  SetMobileMenu,

  RequestMenuInit,
  RequestMenuSuccess,
  RequestMenuFail,

  RequestMainBackgroundInit,
  RequestMainBackgroundSuccess,
  RequestMainBackgroundFail,

  RequestFlickrInit,
  RequestFlickrFail,
  RequestFlickrSuccess,
} from 'app/types/actions/global';
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

  REQUEST_FLICKR_INIT,
  REQUEST_FLICKR_SUCCESS,
  REQUEST_FLICKR_FAIL,
} from 'app/constants/redux';

// History
export function setHistory(history: any): SetHistory {
  return {
    type: SET_HISTORY,
    history,
  };
}
export function setMatched(matched: Matched): SetMatched {
  return {
    type: SET_MATCHED,
    matched,
  };
}
export function setLocation(location: any): SetLocation {
  return {
    type: SET_LOCATION,
    location: {
      ...window.location,
      ...location,
    },
  };
}

// Set HTML <title /> tag
export function setTitle(title: string): SetTitle {
  return {
    type: SET_TITLE,
    title,
  };
}

// Mobile Menu
export function setMobileMenu(status: string | boolean): SetMobileMenu { // 'toggle' || true || false
  return {
    type: SET_MOBILE_MENU,
    status,
  };
}

// Request WP Menu
export function requestMenuInit(slug: string): RequestMenuInit {
  return {
    type: REQUEST_MENU_INIT,
    slug,
  };
}
export function requestMenuSuccess(slug: string, menuArray: Array<Menu>): RequestMenuSuccess {
  return {
    type: REQUEST_MENU_SUCCESS,
    slug,
    menuArray,
  };
}
export function requestMenuFail(slug: string, error: any): RequestMenuFail {
  return {
    type: REQUEST_MENU_FAIL,
    slug,
    error,
  };
}

// Request background images
export function requestMainBackgroundInit(): RequestMainBackgroundInit {
  return {
    type: REQUEST_MAIN_BACKGROUND_INIT,
  };
}
export function requestMainBackgroundSuccess(backgrounds: Array<MainBackground>): RequestMainBackgroundSuccess {
  return {
    type: REQUEST_MAIN_BACKGROUND_SUCCESS,
    backgrounds,
  };
}
export function requestMainBackgroundFail(): RequestMainBackgroundFail {
  return {
    type: REQUEST_MAIN_BACKGROUND_FAIL,
  };
}

// Request Flickr images
export function requestFlickrInit(): RequestFlickrInit {
  return {
    type: REQUEST_FLICKR_INIT,
  };
}
export function requestFlickrSuccess(flickr: Array<Flickr>): RequestFlickrSuccess {
  return {
    type: REQUEST_FLICKR_SUCCESS,
    flickr,
  };
}
export function requestFlickrFail(): RequestFlickrFail {
  return {
    type: REQUEST_FLICKR_FAIL,
  };
}
