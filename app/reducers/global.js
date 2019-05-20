// Import Actions
import {
  SET_MOBILE_MENU,

  GET_MENU_INIT,
  GET_MENU_SUCCESS,
  GET_MENU_FAIL,
} from 'app/actions/global';

import { IS_LOADING } from 'app/constants/common';

// Initial State
const initialState = {
  mobileMenu: false,
  pushed: '',
  menu: {},
};

// Actions
function global(state = initialState, action) {
  switch (action.type) {
    case SET_MOBILE_MENU: {
      return {
        ...state,
        mobileMenu: (action.status === 'toggle') ? !state.mobileMenu : action.status,
      };
    }
    case GET_MENU_INIT: {
      return {
        ...state,
        menu: {
          ...state.menu,
          [action.slug]: IS_LOADING,
        },
      };
    }
    case GET_MENU_SUCCESS: {
      return {
        ...state,
        menu: {
          ...state.menu,
          [action.slug]: action.response.data,
        },
      };
    }
    case GET_MENU_FAIL: {
      return {
        ...state,
        menu: {
          ...state.menu,
          [action.slug]: [],
        },
      };
    }

    default: {
      return state;
    }
  }
}

export default global;
