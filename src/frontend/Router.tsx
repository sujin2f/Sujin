import React, { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

import { Wrapper } from 'src/common/components/layout/Wrapper'
import { Public } from 'src/frontend/scenes/public'
import { NotFound } from 'src/frontend/scenes/public/NotFound'
import { Loading } from 'src/frontend/components/Loading'

const FrontPage = lazy(() => import('src/frontend/scenes/FrontPage'))
const Archive = lazy(() => import('src/frontend/scenes/public/Archive'))
const Page = lazy(() => import('src/frontend/scenes/public/Page'))
const Post = lazy(() => import('src/frontend/scenes/public/Post'))
const DevTool = lazy(() => import('src/frontend/scenes/devtool'))
const CaseTool = lazy(() => import('src/frontend/scenes/devtool/CaseTool'))
const TextSort = lazy(() => import('src/frontend/scenes/devtool/TextSort'))

import 'src/frontend/scss/wrapper.scss'

export function Router() {
    return (
        <Wrapper>
            <Suspense fallback={<Loading />}>
                <Routes>
                    <Route
                        element={<FrontPage />}
                        path="/"
                    />

                    <Route
                        element={
                            <DevTool>
                                <CaseTool />
                            </DevTool>
                        }
                        path="/dev-tools/case"
                    />

                    <Route
                        element={
                            <DevTool>
                                <TextSort />
                            </DevTool>
                        }
                        path="/dev-tools/text-sort"
                    />

                    <Route
                        element={
                            <Public>
                                <Page />
                            </Public>
                        }
                        path="/:slug"
                    />

                    <Route
                        element={
                            <Public>
                                <Archive />
                            </Public>
                        }
                        path="/:type/:slug"
                    />

                    <Route
                        element={
                            <Public>
                                <Archive />
                            </Public>
                        }
                        path="/:type/:slug/page/:page"
                    />

                    <Route
                        element={
                            <Public>
                                <Post />
                            </Public>
                        }
                        path="/:year/:month/:day/:slug"
                    />

                    <Route
                        element={
                            <Public>
                                <NotFound />
                            </Public>
                        }
                        path="*"
                    />
                </Routes>
            </Suspense>
        </Wrapper>
    )
}
