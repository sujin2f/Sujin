import global from './global';
import post from './post';

const { combineReducers } = wp.data;

const reducer = combineReducers({
  global,
  post,
});

export default reducer;
