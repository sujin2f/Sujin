// Apollo
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

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

// Style
import '../assets/styles/app.scss';

// GraphQL
const httpLink = createHttpLink({
  uri: 'http://sujinc.test/graphql',
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

// Do something!
((wp) => {
  const { render } = wp.element;
  const { registerStore } = wp.data;

  registerStore(STORE, { reducer, selectors, actions });

  render(
    <ApolloProvider client={client}>
      <Public>
        <Router>
          {/* Front Page */}
          <Route path="/">
            <FrontPage />
          </Route>

          {/* Test Page */}
          <Route path="/app">
            <Page />
          </Route>
        </Router>
      </Public>
    </ApolloProvider>,
    document.getElementById('app'),
  );
})(window.wp);
