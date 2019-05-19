import global from './global';
import history from './history';
import flickr from './flickr';
import frontPage from './front-page';

const { combineReducers } = wp.data;

const reducer = combineReducers({
  global,
  history,
  flickr,
  frontPage,
});

export default reducer;
