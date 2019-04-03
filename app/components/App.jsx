import React, { Component } from 'react';
import Public from 'app/scenes/Public';

import Router from 'app/components/router/Router';
import Route from 'app/components/router/Route';

import FrontPageContainer from 'app/scenes/FrontPage';
import FrontPage from 'app/scenes/FrontPage/FrontPage';
import Page from 'app/scenes/Public/Page';

class App extends Component {
  render() {
    return (
      <Router>
        <Route path="/">
          <FrontPageContainer>
            <FrontPage />
          </FrontPageContainer>
        </Route>
        <Route path="/app">
          <Public>
            <Page />
          </Public>
        </Route>
      </Router>
    );
  }
}

export default App;
