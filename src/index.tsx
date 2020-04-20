import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

import { Public } from 'scenes/public'
import { Archive } from 'scenes/public/Archive'
import { FrontPage } from 'scenes/public/FrontPage'
import { NotFound } from 'scenes/public/NotFound'
import { Page } from 'scenes/public/Page'
import { Post } from 'scenes/public/Post'
import { Store } from 'store'

import * as serviceWorker from './serviceWorker'

/* tslint:disable:jsx-wrap-multiline */
ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Store>
        <Public>
          <Switch>
            <Route exact={true} path="/">
              <FrontPage />
            </Route>

            <Route exact={true} path="/:year([0-9]+)/:month([0-9]+)/:day([0-9]+)/:slug">
              <Post />
            </Route>

            <Route exact={true} path="/:slug">
              <Page />
            </Route>

            <Route exact={true} path="/:type/:slug">
              <Archive />
            </Route>

            <Route exact={true} path="/:type/:slug/page/:page?">
              <Archive />
            </Route>

            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </Public>
      </Store>
    </Router>
  </React.StrictMode>,
  document.getElementById('app')
)
/* tslint:enable:jsx-wrap-multiline */

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
