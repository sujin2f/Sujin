import * as global from './global';
import * as history from './history';
import * as flickr from './flickr';
import * as frontPage from './front-page';
import * as page from './page';
import * as archive from './archive';
import * as post from './post';

export default {
  ...global,
  ...history,
  ...flickr,
  ...frontPage,
  ...page,
  ...archive,
  ...post,
};
