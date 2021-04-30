import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from 'src/frontend/serviceWorker'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import { Public } from 'src/frontend/scenes/public'
import { Archive } from 'src/frontend/scenes/public/Archive'
import { FrontPage } from 'src/frontend/scenes/public/FrontPage'
import { NotFound } from 'src/frontend/scenes/public/NotFound'
import { Page } from 'src/frontend/scenes/public/Page'
import { Post } from 'src/frontend/scenes/public/Post'
import { Store } from 'src/frontend/store'

import 'src/assets/styles/style.scss'

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <Store>
                <Public>
                    <Switch>
                        <Route exact={true} path="/">
                            <FrontPage />
                        </Route>

                        <Route
                            exact={true}
                            path="/:year([0-9]+)/:month([0-9]+)/:day([0-9]+)/:slug"
                        >
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
    document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()
