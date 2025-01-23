'use client'

import React, { Suspense, use, useEffect, useState } from 'react'

import { fetchGQL } from '@common/data/graphql/fetchGQL'
import { postOpr, queryRecent } from '@src/constants/graphql'
import { Post } from '@src/types/wordpress'
import { Loading } from '@components/(wordpress)/archive/loading'
import { WidgetTitle } from '@components/WidgetTitle'
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'
import { Cards } from '@components/(wordpress)/archive/cards'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'

const NotFoundArticles = (param: { posts: Promise<Post[]> }) => {
    const posts = use(param.posts)

    return (
        <>
            <Row>
                <Cards
                    posts={posts}
                    keyPrefix="not-found"
                    large={4}
                    medium={6}
                    small={12}
                />
            </Row>
        </>
    )
}

export default function NotFound() {
    const [request, setRequest] = useState<Promise<Post[]>>()
    useEffect(
        () => setRequest(fetchGQL(queryRecent, postOpr, WEEK_IN_SECONDS)),
        [],
    )

    return (
        <>
            <Row>
                <Column small={12}>
                    <WidgetTitle>Recent Posts</WidgetTitle>
                </Column>
            </Row>

            <Suspense
                fallback={
                    <Loading
                        className="archive"
                        counts={12}
                        large={4}
                        medium={6}
                        small={12}
                    />
                }
            >
                {request && <NotFoundArticles posts={request} />}
            </Suspense>
        </>
    )
}
