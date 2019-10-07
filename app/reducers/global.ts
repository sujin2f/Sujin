// Types
import Matched from 'app/types/matched';
import GlobalState from 'app/types/states/global';
import GlobalActions from 'app/types/actions/global';
import MainBackgroundArray from 'app/types/responses/main-background';

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
  backgrounds: undefined,
  flickr: undefined,
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

    // Request background images
    case REQUEST_MAIN_BACKGROUND_INIT: {
      return {
        ...state,
        backgrounds: true,
      };
    }
    case REQUEST_MAIN_BACKGROUND_SUCCESS: {
      return {
        ...state,
        backgrounds: [...action.backgrounds],
      };
    }
    case REQUEST_MAIN_BACKGROUND_FAIL: {
      return {
        ...state,
        backgrounds: false,
      };
    }

    // Request Flickr images
    case REQUEST_FLICKR_INIT: {
      return {
        ...state,
        flickr: true,
      };
    }
    case REQUEST_FLICKR_SUCCESS: {
      return {
        ...state,
        flickr: [...action.flickr],
      };
    }
    case REQUEST_FLICKR_FAIL: {
      return {
        ...state,
        flickr: false,
      };
    }

    default: {
      return state;
    }
  }
}

export default global;
