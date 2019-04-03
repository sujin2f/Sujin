import { SET_HISTORY } from 'app/actions/history';

// Initial State
const initialState = {};

// Actions
function history(state = initialState, action) {
  switch (action.type) {
    case SET_HISTORY: {
      return {
        ...state,
        ...action.history,
      };
    }

    default: {
      return state;
    }
  }
}

export default history;
