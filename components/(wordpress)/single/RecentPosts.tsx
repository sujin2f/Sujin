'use client'

import React, { useEffect, useState } from 'react'

import { Row } from '@common/components/layout/Row'
import { WidgetTitle } from '@components/WidgetTitle'
import { Post } from '@src/types/wordpress'
import { Cards } from '@components/(wordpress)/archive/cards'
import { Loading } from '../archive/loading'
import { fetchGQL } from '@common/data/graphql/fetchGQL'
import { postOpr, queryRecent } from '@src/constants/graphql'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'

import '@src/scss/recent-post.scss'

export const RecentPosts = ({ current }: { current: number }) => {
    const [posts, setPosts] = useState<Post[] | boolean>(false)
    useEffect(() => {
        fetchGQL(queryRecent, postOpr, WEEK_IN_SECONDS)
            .then((result) => setPosts(result))
            .catch(() => setPosts([]))
    }, [])

    if (!Array.isArray(posts)) {
        return (
            <>
                <WidgetTitle>Recent Posts</WidgetTitle>
                <Loading className="recent" counts={4} small={12} fullWidth />
            </>
        )
    }

    if (posts) {
        return (
            <section className="recent-posts show-for-large">
                <WidgetTitle>Recent Posts</WidgetTitle>
                <Row fullWidth>
                    <Cards
                        posts={posts
                            .filter((item) => item.id !== current)
                            .slice(0, 4)}
                        keyPrefix="recent"
                    />
                </Row>
            </section>
        )
    }

    return <></>
}
