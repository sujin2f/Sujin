// TODO semantic elements
// https://webflow.com/blog
// /html5-semantic-elements-and-webflow-the-essential-guide
// Redux

import { STORE } from 'app/constants/common';

// Router
import Router from 'app/components/router/Router';

// Scenes
import FrontPage from 'app/scenes/public/FrontPage';
import Archive from 'app/scenes/public/Archive';
import { Page } from 'app/scenes/public/Page';
import { Post } from 'app/scenes/public/Post';
import NotFound from 'app/scenes/public/NotFound';

declare global {
  interface Window {
    wp;
  }
}

((wp): void => {
  const { render } = wp.element;

  render(
    <Router>
      <FrontPage path="/" />
      <Post path="/:year([0-9]+)/:month([0-9]+)/:day([0-9]+)/:slug" />
      <Page path="/:slug" />
      <Archive path="/:type/:slug" />
      <Archive path="/:type/:slug/page/:page?" />
      <NotFound />
    </Router>,
    document.getElementById('app'),
  );

  document.getElementsByTagName('body')[0].classList.add('unicorn');
})(window.wp);
