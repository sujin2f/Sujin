import global from './global';
import post from './post';
import page from './page';
import archive from './archive';

const { combineReducers } = wp.data;

const reducer = combineReducers({
  global,
  post,
  page,
  archive,
});

export default reducer;
