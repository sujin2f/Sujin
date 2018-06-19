/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';

import routes from 'app/routes';

// Scenes
import Public from 'app/scenes/public';

export default () => (
  <Public>
    <Switch>
      {routes.public.map(route => <Route key={route.path} {...route} />)}
    </Switch>
  </Public>
);
