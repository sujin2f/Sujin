// Types
import {
  SetHistory,
  SetLocation,

  SetTitle,
  SetMobileMenu,
} from 'app/types/actions/global';
import {
  SET_HISTORY,
  SET_LOCATION,

  SET_TITLE,
  SET_MOBILE_MENU,
} from 'app/constants/redux';

// History
export function setHistory(history): SetHistory {
  return {
    type: SET_HISTORY,
    history,
  };
}
export function setLocation(location): SetLocation {
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

// Mobile Menu: 'toggle' || true || false
export function setMobileMenu(status: string | boolean): SetMobileMenu {
  return {
    type: SET_MOBILE_MENU,
    status,
  };
}
