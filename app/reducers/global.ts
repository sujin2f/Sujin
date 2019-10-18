// Types
import GlobalState from 'app/types/states/global';
import GlobalActions from 'app/types/actions/global';

import {
  SET_HISTORY,
  SET_LOCATION,
  SET_MOBILE_MENU,
} from 'app/constants/redux';

// Initial State
const initState: GlobalState = {
  history: {
    history: {},
    location: {},
  },
  mobileMenu: false,
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
    case SET_LOCATION: {
      return {
        ...state,
        history: {
          ...state.history,
          location: action.location,
        },
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
