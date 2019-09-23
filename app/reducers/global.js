// Import Actions
import {
  SET_MOBILE_MENU,
  SET_TITLE,

  REQUEST_MENU_INIT,
  REQUEST_MENU_SUCCESS,
  REQUEST_MENU_FAIL,
} from 'app/actions/global';

import { DEFAULT_TITLE } from 'app/constants/common';
import { setTitle } from 'app/utils/common';

// Initial State
const initialState = {
  mobileMenu: false,
  pushed: '',
  menu: {},
  title: DEFAULT_TITLE,
};

// Actions
function global(state = initialState, action) {
  switch (action.type) {
    case SET_TITLE: {
      setTitle(action.title);
      return {
        ...state,
        title: action.title,
      };
    }
    case SET_MOBILE_MENU: {
      return {
        ...state,
        mobileMenu: (action.status === 'toggle') ? !state.mobileMenu : action.status,
      };
    }
    case REQUEST_MENU_INIT: {
      return {
        ...state,
        menu: {
          ...state.menu,
          [action.slug]: [],
        },
      };
    }
    case REQUEST_MENU_SUCCESS: {
      return {
        ...state,
        menu: {
          ...state.menu,
          [action.slug]: action.response.data,
        },
      };
    }
    case REQUEST_MENU_FAIL: {
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
