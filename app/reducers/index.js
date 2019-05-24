import global from './global';
import history from './history';
import flickr from './flickr';
import frontPage from './front-page';
import page from './page';
import archive from './archive';
import post from './post';

const { combineReducers } = wp.data;

const reducer = combineReducers({
  global,
  history,
  flickr,
  frontPage,
  page,
  archive,
  post,
});

export default reducer;
