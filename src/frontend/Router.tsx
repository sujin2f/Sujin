import React, { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

import { Wrapper } from '@common/components/layout/Wrapper'
import { DevTool } from '@frontend/scenes/devtool'
import { Public } from '@frontend/scenes/public'
import { NotFound } from '@frontend/scenes/public/NotFound'
import { Loading } from '@frontend/components/Loading'

const FrontPage = lazy(() => import('src/frontend/scenes/FrontPage'))
const Archive = lazy(() => import('src/frontend/scenes/public/Archive'))
const Page = lazy(() => import('src/frontend/scenes/public/Page'))
const Post = lazy(() => import('src/frontend/scenes/public/Post'))
const CaseTool = lazy(() => import('src/frontend/scenes/devtool/CaseTool'))
const TextSort = lazy(() => import('src/frontend/scenes/devtool/TextSort'))

import 'src/frontend/scss/wrapper.scss'

export function Router() {
    return (
        <Wrapper>
            <Routes>
                <Route
                    element={
                        <Suspense fallback={<Loading />}>
                            <FrontPage />
                        </Suspense>
                    }
                    path="/"
                />

                <Route
                    element={
                        <DevTool>
                            <Suspense fallback={<Loading />}>
                                <CaseTool />
                            </Suspense>
                        </DevTool>
                    }
                    path="/dev-tools/case"
                />

                <Route
                    element={
                        <DevTool>
                            <Suspense fallback={<Loading />}>
                                <TextSort />
                            </Suspense>
                        </DevTool>
                    }
                    path="/dev-tools/text-sort"
                />

                <Route
                    element={
                        <Public>
                            <Suspense fallback={<Loading />}>
                                <Page />
                            </Suspense>
                        </Public>
                    }
                    path="/:slug"
                />

                <Route
                    element={
                        <Public>
                            <Suspense fallback={<Loading />}>
                                <Archive />
                            </Suspense>
                        </Public>
                    }
                    path="/:type/:slug"
                />

                <Route
                    element={
                        <Public>
                            <Suspense fallback={<Loading />}>
                                <Archive />
                            </Suspense>
                        </Public>
                    }
                    path="/:type/:slug/page/:page"
                />

                <Route
                    element={
                        <Public>
                            <Suspense fallback={<Loading />}>
                                <Post />
                            </Suspense>
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
        </Wrapper>
    )
}
