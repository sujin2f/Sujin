import React, { Component } from 'react';
import Public from 'app/scenes/public';

import Router from 'app/components/router/Router';
import Route from 'app/components/router/Route';

import FrontPage from 'app/scenes/public/FrontPage';
import Page from 'app/scenes/public/Page';

class App extends Component {
  render() {
    return (
      <Public>
        <Router>
          <Route path="/">
            <FrontPage />
          </Route>
          <Route path="/app">
            <Page />
          </Route>
        </Router>
      </Public>
    );
  }
}

export default App;
