// Types
import Matched from 'app/types/matched';
import {
  SetHistory,
  SetMatched,
  SetLocation,

  SetTitle,
  SetMobileMenu,
} from 'app/types/actions/global';
import {
  SET_HISTORY,
  SET_MATCHED,
  SET_LOCATION,

  SET_TITLE,
  SET_MOBILE_MENU,
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
