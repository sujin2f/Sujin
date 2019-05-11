// Import Actions
import {
  TOGGLE_SCROLL,
  TOGGLE_MOBILE_MENU,
  RESET_MOBILE_MENU,

  GET_MENU_INIT,
  GET_MENU_SUCCESS,
  GET_MENU_FAIL,
} from 'app/actions/global';

// Initial State
const initialState = {
  scrolled: '',
  mobileMenu: false,
  pushed: '',
  menu: {},
};

// Actions
function global(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_SCROLL: {
      return {
        ...state,
        scrolled: action.key,
      };
    }
    case TOGGLE_MOBILE_MENU: {
      return {
        ...state,
        mobileMenu: !state.mobileMenu,
      };
    }
    case RESET_MOBILE_MENU: {
      return {
        ...state,
        mobileMenu: false,
      };
    }

    case GET_MENU_INIT: {
      return {
        ...state,
        menu: {},
      };
    }
    case GET_MENU_SUCCESS: {
      const menu = action.response.data.map(m => ({
        title: m.title,
        url: m.url,
      }));
      console.log(action.menuType);
      return {
        ...state,
        menu: {
          ...state.menu,
          [action.menuType]: menu,
        },
      };
    }
    case GET_MENU_FAIL: {
      return {
        ...state,
        menu: {
          ...state.menu,
          [action.menuType]: [],
        },
      };
    }

    default: {
      return state;
    }
  }
}

export default global;
