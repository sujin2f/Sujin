'use client'

import React, { Suspense, use, useEffect, useState } from 'react'

import { Row } from '@common/components/layout/Row'
import { WidgetTitle } from '@components/WidgetTitle'
import { Term } from '@src/types/wordpress'
import { Cards } from '@components/(wordpress)/archive/cards'

import '@src/scss/recent-post.scss'
import { Loading } from '../archive/loading'
import fetchGQL from '@common/graphql/fetchGQL'
import { archiveOpr, queryRecent } from '@src/constants/graphql'

type Props = {
    readonly current: number
    readonly term: Promise<Term>
}

const Component = (props: Props) => {
    const { posts } = use(props.term)

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
    const [recent, setRecent] = useState<Promise<Term>>()
    useEffect(() => setRecent(fetchGQL(queryRecent, archiveOpr)), [])

    return (
        <Suspense
            fallback={
                <Loading className="recent" counts={4} small={12} fullWidth />
            }
        >
            {recent && <Component current={current} term={recent} />}
        </Suspense>
    )
}
