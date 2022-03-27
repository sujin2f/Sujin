import React from 'react'
import { Switch, Route } from 'react-router-dom'

import {
    Public,
    Archive,
    FrontPage,
    NotFound,
    Page,
    Post,
} from 'src/frontend/scenes/public'

export const Router = (): JSX.Element => {
    return (
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
    )
}
