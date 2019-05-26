import {
  SET_HISTORY,
  SET_MATCHED,
  SET_LOCATION,
} from 'app/actions/history';

// Initial State
const initialState = {
  history: {},
  matched: {},
  location: {},
};

// Actions
function history(state = initialState, action) {
  switch (action.type) {
    case SET_HISTORY: {
      return {
        ...state,
        history: action.history,
      };
    }

    case SET_MATCHED: {
      return {
        ...state,
        matched: action.matched,
      };
    }

    case SET_LOCATION: {
      return {
        ...state,
        location: action.location,
      };
    }

    default: {
      return state;
    }
  }
}

export default history;
