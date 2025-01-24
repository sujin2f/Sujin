'use client'

import React, { useEffect } from 'react'

import { Row } from '@common/components/layout/Row'
import { WidgetTitle } from '@components/WidgetTitle'
import { Post } from '@src/types/wordpress'
import { Cards } from '@components/(wordpress)/archive/cards'
import { Loading } from '../archive/loading'
import { fetchGQL } from '@common/data/graphql/fetchGQL'
import { postOpr, queryRecent } from '@src/constants/graphql'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import { useGlobalState } from '@common/hooks/useGlobalState'

import '@src/scss/recent-post.scss'

export const RecentPosts = ({ current }: { current: number }) => {
    const [posts, setPosts] = useGlobalState<Post[] | boolean>(
        'recent-posts',
        false,
    )
    useEffect(() => {
        if (!posts) {
            setPosts(true) // Prevent fetching again
            const fetchRecentPosts = async () => {
                const response = await fetchGQL(
                    queryRecent,
                    postOpr,
                    WEEK_IN_SECONDS,
                ).catch(() => true)
                setPosts(response)
            }
            fetchRecentPosts()
        }
    }, [posts, setPosts])

    if (!Array.isArray(posts)) {
        return <></>
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

    return <Loading className="recent" counts={4} small={12} fullWidth />
}
