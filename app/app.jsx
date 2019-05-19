// Redux
import { STORE } from 'app/constants/common';
import selectors from 'app/selectors';
import actions from 'app/actions';
import reducer from 'app/reducers';

// Router
import Router from 'app/components/router/Router';
import Route from 'app/components/router/Route';

// Scenes
import Public from 'app/scenes/Public';
import FrontPage from 'app/scenes/Public/FrontPage';
import Page from 'app/scenes/Public/Page';
import Archive from 'app/scenes/Public/Archive';

((wp) => {
  const { render } = wp.element;
  const { registerStore } = wp.data;

  registerStore(STORE, { reducer, selectors, actions });

  render(
    <Router>
      {/* Front Page */}
      <Route path="/">
        <Public footerClass="front-page">
          <FrontPage />
        </Public>
      </Route>

      <Route path="/category/([\w-]+)">
        <Public>
          <Archive />
        </Public>
      </Route>

      <Route path="/tag/([\w-]+)">
        <Public>
          <Archive />
        </Public>
      </Route>

      <Route path="/search/([\w-]+)">
        <Public>
          <Archive />
        </Public>
      </Route>

      <Route path="/([\w-]+)">
        <Public>
          <Page />
        </Public>
      </Route>
    </Router>,
    document.getElementById('app'),
  );
})(window.wp);
