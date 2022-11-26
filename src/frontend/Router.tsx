import React from 'react'
import { Routes, Route } from 'react-router-dom'

import { Public } from 'src/frontend/scenes/public'
import { Archive } from 'src/frontend/scenes/public/Archive'
import { FrontPage } from 'src/frontend/scenes/public/FrontPage'
import { NotFound } from 'src/frontend/scenes/public/NotFound'
import { Page } from 'src/frontend/scenes/public/Page'
import { Post } from 'src/frontend/scenes/public/Post'

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
                path="/:type/:slug/page/:page"
                element={
                    <Public>
                        <Archive />
                    </Public>
                }
            />

            <Route
                path="/:year/:month/:day/:slug"
                element={
                    <Public>
                        <Post />
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
