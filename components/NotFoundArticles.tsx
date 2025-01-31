'use client'

import React, { useEffect, useState } from 'react'

import { fetchGQL } from '@common/data/graphql/fetchGQL'
import { postOpr, queryRecent } from '@src/constants/graphql'
import { Post } from '@src/types/wordpress'
import { Loading } from '@components/(wordpress)/archive/loading'
import { WidgetTitle } from '@components/WidgetTitle'
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'
import { Cards } from '@components/(wordpress)/archive/cards'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'

export default function NotFoundArticles() {
    const [posts, setPosts] = useState<Post[] | boolean>(false)
    useEffect(() => {
        fetchGQL(queryRecent, postOpr, WEEK_IN_SECONDS)
            .then((result) => setPosts(result))
            .catch(() => setPosts([]))
    }, [])

    if (Array.isArray(posts)) {
        return (
            <main>
                <Row>
                    <Column small={12}>
                        <WidgetTitle>Recent Posts</WidgetTitle>
                    </Column>
                </Row>
                <Row>
                    <Cards
                        posts={posts}
                        keyPrefix="not-found"
                        large={4}
                        medium={6}
                        small={12}
                    />
                </Row>
            </main>
        )
    }

    return (
        <main>
            <Row>
                <Column small={12}>
                    <WidgetTitle>Recent Posts</WidgetTitle>
                </Column>
            </Row>
            <Loading
                className="archive"
                counts={12}
                large={4}
                medium={6}
                small={12}
            />
        </main>
    )
}
