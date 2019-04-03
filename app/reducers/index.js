import global from './global';
import history from './history';

const { combineReducers } = wp.data;

const reducer = combineReducers({
  global,
  history,
});

export default reducer;
