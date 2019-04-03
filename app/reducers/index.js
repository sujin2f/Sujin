import global from './global';
import history from './history';
import flickr from './flickr';

const { combineReducers } = wp.data;

const reducer = combineReducers({
  global,
  history,
  flickr,
});

export default reducer;
