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
        <Switch>
            <Route exact={true} path="/">
                <Public>
                    <FrontPage />
                </Public>
            </Route>

            <Route
                exact={true}
                path="/:year([0-9]+)/:month([0-9]+)/:day([0-9]+)/:slug"
            >
                <Public>
                    <Post />
                </Public>
            </Route>

            <Route exact={true} path="/:slug">
                <Public>
                    <Page />
                </Public>
            </Route>

            <Route exact={true} path="/:type/:slug">
                <Public>
                    <Archive />
                </Public>
            </Route>

            <Route exact={true} path="/:type/:slug/page/:page?">
                <Public>
                    <Archive />
                </Public>
            </Route>

            <Route path="*">
                <Public>
                    <NotFound />
                </Public>
            </Route>
        </Switch>
    )
}
