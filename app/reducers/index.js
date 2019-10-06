import global from './global';
import post from './post';
import page from './page';

const { combineReducers } = wp.data;

const reducer = combineReducers({
  global,
  post,
  page,
});

export default reducer;
