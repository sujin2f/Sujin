import React, { Suspense, lazy } from 'react'
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

require('src/frontend/scss/wrapper.scss')

export const Router = (): JSX.Element => {
    return (
        <Suspense fallback={<Loading />}>
            <Wrapper>
                <Routes>
                    <Route path="/" element={<FrontPage />} />

                    <Route
                        path="/dev-tools/case"
                        element={
                            <DevTool>
                                <CaseTool />
                            </DevTool>
                        }
                    />

                    <Route
                        path="/dev-tools/text-sort"
                        element={
                            <DevTool>
                                <TextSort />
                            </DevTool>
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
            </Wrapper>
        </Suspense>
    )
}
