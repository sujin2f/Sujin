// TODO semantic elements
// https://webflow.com/blog
// /html5-semantic-elements-and-webflow-the-essential-guide
// Redux
declare global {
  interface Window {
    wp: any;
  }
}

// Redux
import { STORE } from 'app/constants/common';
import selectors from 'app/selectors';
import actions from 'app/actions';
import reducer from 'app/reducers';

// Router
import Router from 'app/components/router/Router';

// Scenes
import FrontPage from 'app/scenes/public/FrontPage';
import Archive from 'app/scenes/public/Archive';
import Page from 'app/scenes/public/Page';
import Post from 'app/scenes/public/Post';
import NotFound from 'app/scenes/public/NotFound';

((wp) => {
  const { registerStore } = wp.data;
  registerStore(STORE, { reducer, selectors, actions });

  const { render } = wp.element;
  render(
    <Router>
      <FrontPage path="/" />
      <Archive path="/category/:category/page/:page?" />
      <Archive path="/category/:category" />
      <Archive path="/tag/:tag/page/:page?" />
      <Archive path="/tag/:tag" />
      <Archive path="/search/:search/page/:page?" />
      <Archive path="/search/:search" />
      <Post path="/:year([0-9]+)/:month([0-9]+)/:day([0-9]+)/:postSlug" />
      <Page path="/:slug" />
      <NotFound />
    </Router>,
    document.getElementById('app'),
  );

  document.getElementsByTagName('body')[0].classList.add('unicorn');
})(window.wp);
