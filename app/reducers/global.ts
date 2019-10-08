// Types
import Matched from 'app/types/matched';
import GlobalState from 'app/types/states/global';
import GlobalActions from 'app/types/actions/global';

import {
  SET_HISTORY,
  SET_MATCHED,
  SET_LOCATION,

  SET_TITLE,
  SET_MOBILE_MENU,

  REQUEST_MENU_INIT,
  REQUEST_MENU_SUCCESS,
  REQUEST_MENU_FAIL,
} from 'app/constants/redux';

import { DEFAULT_TITLE } from 'app/constants/common';
import { setTitle } from 'app/utils/common';

// Initial State
const initState: GlobalState = {
  history: {
    history: {},
    matched: new Matched({}),
    location: {},
  },
  mobileMenu: false,
  title: DEFAULT_TITLE,
  menu: {},
};

// Actions
function global(state: GlobalState = initState, action: GlobalActions): GlobalState {
  switch (action.type) {
    // History
    case SET_HISTORY: {
      return {
        ...state,
        history: {
          ...state.history,
          history: action.history,
        },
      };
    }
    case SET_MATCHED: {
      return {
        ...state,
        history: {
          ...state.history,
          matched: action.matched,
        },
      };
    }
    case SET_LOCATION: {
      return {
        ...state,
        history: {
          ...state.history,
          location: action.location,
        },
      };
    }

    // Set HTML <title /> tag
    case SET_TITLE: {
      setTitle(action.title);
      return {
        ...state,
        title: action.title,
      };
    }

    // Mobile Menu
    case SET_MOBILE_MENU: {
      let mobileMenu = !state.mobileMenu;
      if (typeof action.status === 'boolean') {
        mobileMenu = action.status;
      }

      return {
        ...state,
        mobileMenu,
      };
    }

    // Request WP Menu
    case REQUEST_MENU_INIT: {
      const menu = { ...state.menu };
      menu[action.slug] = true

      return {
        ...state,
        menu,
      };
    }
    case REQUEST_MENU_SUCCESS: {
      const menu = { ...state.menu };
      menu[action.slug] = action.menuArray

      return {
        ...state,
        menu,
      };
    }
    case REQUEST_MENU_FAIL: {
      const menu = { ...state.menu };
      menu[action.slug] = false;

      return {
        ...state,
        menu,
      };
    }

    default: {
      return state;
    }
  }
}

export default global;
