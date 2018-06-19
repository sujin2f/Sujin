import React, { Component } from 'react';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';

import routes from 'app/routes';
import Public from 'app/scenes/public';

class App extends Component {
  render() {
    return (
      <Public>
        <Switch>
          {routes.public.map(route => <Route key={route.path} {...route} />)}
        </Switch>
      </Public>
    );
  }
}

export default App;
