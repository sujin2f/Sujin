// Types
import {
  SetHistory,
  SetLocation,
  SetMobileMenu,
} from 'app/types/actions/global';
import {
  SET_HISTORY,
  SET_LOCATION,
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

// Mobile Menu: 'toggle' || true || false
export function setMobileMenu(status: string | boolean): SetMobileMenu {
  return {
    type: SET_MOBILE_MENU,
    status,
  };
}
