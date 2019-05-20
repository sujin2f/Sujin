import global from './global';
import history from './history';
import flickr from './flickr';
import frontPage from './front-page';
import page from './page';

const { combineReducers } = wp.data;

const reducer = combineReducers({
  global,
  history,
  flickr,
  frontPage,
  page,
});

export default reducer;
