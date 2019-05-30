// Redux
import { STORE } from 'app/constants/common';
import selectors from 'app/selectors';
import actions from 'app/actions';
import reducer from 'app/reducers';

// Router
import Router from 'app/components/router/Router';
import Route from 'app/components/router/Route';
import NoMatch from 'app/components/router/NoMatch';

// Scenes
import FrontPage from 'app/scenes/Public/FrontPage';
import Archive from 'app/scenes/Public/Archive';
import Page from 'app/scenes/Public/Page';
import Post from 'app/scenes/Public/Post';
import NotFound from 'app/scenes/Public/NotFound';

((wp) => {
  const { render } = wp.element;
  const { registerStore } = wp.data;

  registerStore(STORE, { reducer, selectors, actions });

  render(
    <Router>
      <Route path="/">
        <FrontPage />
      </Route>

      <Route path="/category/:category/page/:page?">
        <Archive />
      </Route>

      <Route path="/category/:category">
        <Archive />
      </Route>

      <Route path="/tag/:tag/page/:page?">
        <Archive />
      </Route>

      <Route path="/tag/:tag">
        <Archive />
      </Route>

      <Route path="/search/:search/page/:page?">
        <Archive />
      </Route>

      <Route path="/search/:search">
        <Archive />
      </Route>

      <Route path="/:year([0-9]+)/:month([0-9]+)/:day([0-9]+)/:postSlug">
        <Post />
      </Route>

      <Route path="/:slug">
        <Page />
      </Route>

      <NoMatch>
        <NotFound />
      </NoMatch>
    </Router>,
    document.getElementById('app'),
  );

  document.getElementsByTagName('body')[0].classList.add('unicorn');
})(window.wp);
