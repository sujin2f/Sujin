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

    default: {
      return state;
    }
  }
}

export default global;
