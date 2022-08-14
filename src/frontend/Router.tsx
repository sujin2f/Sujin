import React from 'react'
import { Routes, Route } from 'react-router-dom'

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
        <Routes>
            <Route
                path="/"
                element={
                    <Public>
                        <FrontPage />
                    </Public>
                }
            />

            <Route
                path="/:year([0-9]+)/:month([0-9]+)/:day([0-9]+)/:slug"
                element={
                    <Public>
                        <Post />
                    </Public>
                }
            />

            <Route
                path="/:slug"
                element={
                    <Public>
                        <Page />
                    </Public>
                }
            />

            <Route
                path="/:type/:slug"
                element={
                    <Public>
                        <Archive />
                    </Public>
                }
            />

            <Route
                path="/:type/:slug/page/:page?"
                element={
                    <Public>
                        <Archive />
                    </Public>
                }
            />

            <Route
                path="*"
                element={
                    <Public>
                        <NotFound />
                    </Public>
                }
            />
        </Routes>
    )
}
