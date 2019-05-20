import * as global from './global';
import * as history from './history';
import * as flickr from './flickr';
import * as frontPage from './front-page';
import * as page from './page';

export default {
  ...global,
  ...history,
  ...flickr,
  ...frontPage,
  ...page,
};
