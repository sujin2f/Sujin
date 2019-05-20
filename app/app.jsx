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
      <Route path="/">
        <Public className="stretched-background hideFooter">
          <FrontPage />
        </Public>
      </Route>

      <Route path="/category/([a-zA-Z0-9-_%]+)">
        <Public>
          <Archive />
        </Public>
      </Route>

      <Route path="/category/([a-zA-Z0-9-_%]+)/page/([0-9]+)">
        <Public>
          <Archive />
        </Public>
      </Route>

      <Route path="/tag/([a-zA-Z0-9-_%]+)">
        <Public>
          <Archive />
        </Public>
      </Route>

      <Route path="/tag/([a-zA-Z0-9-_%]+)/page/([0-9]+)">
        <Public>
          <Archive />
        </Public>
      </Route>

      <Route path="/search/([a-zA-Z0-9-_%]+)">
        <Public>
          <Archive />
        </Public>
      </Route>

      <Route path="/search/([a-zA-Z0-9-_\%]+)/?page/([0-9]+)">
        <Public>
          <Archive />
        </Public>
      </Route>

      <Route path="/([a-zA-Z0-9-_\%]+)">
        <Public>
          <Page />
        </Public>
      </Route>
    </Router>,
    document.getElementById('app'),
  );
})(window.wp);
