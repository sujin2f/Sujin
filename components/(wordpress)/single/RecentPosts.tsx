'use client'

import React, { Suspense, use, useEffect, useState } from 'react'

import { Row } from '@common/components/layout/Row'
import { WidgetTitle } from '@components/WidgetTitle'
import { Post } from '@src/types/wordpress'
import { Cards } from '@components/(wordpress)/archive/cards'
import { Loading } from '../archive/loading'
import { fetchGQL } from '@common/data/graphql/fetchGQL'
import { postOpr, queryRecent } from '@src/constants/graphql'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'

import '@src/scss/recent-post.scss'

type Props = {
    readonly current: number
    readonly posts: Promise<Post[]>
}

const Component = (props: Props) => {
    const posts = use(props.posts)

    return (
        <section className="recent-posts show-for-large">
            <WidgetTitle>Recent Posts</WidgetTitle>
            <Row fullWidth>
                <Cards
                    posts={posts
                        .filter((item) => item.id !== props.current)
                        .slice(0, 4)}
                    keyPrefix="recent"
                />
            </Row>
        </section>
    )
}

export const RecentPosts = ({ current }: { current: number }) => {
    const [recent, setRecent] = useState<Promise<Post[]>>()
    useEffect(
        () => setRecent(fetchGQL(queryRecent, postOpr, WEEK_IN_SECONDS)),
        [],
    )

    return (
        <Suspense
            fallback={
                <Loading className="recent" counts={4} small={12} fullWidth />
            }
        >
            {recent && <Component current={current} posts={recent} />}
        </Suspense>
    )
}
