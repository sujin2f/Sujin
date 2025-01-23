'use client'

import React, { useEffect } from 'react'

import { fetchGQL } from '@common/data/graphql/fetchGQL'
import { postOpr, queryRecent } from '@src/constants/graphql'
import { Post } from '@src/types/wordpress'
import { Loading } from '@components/(wordpress)/archive/loading'
import { WidgetTitle } from '@components/WidgetTitle'
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'
import { Cards } from '@components/(wordpress)/archive/cards'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import { useGlobalState } from '@common/hooks/useGlobalState'

export default function NotFound() {
    const [posts, setPosts] = useGlobalState<Post[] | null>('recent-posts', [])
    useEffect(() => {
        if (posts && !posts.length) {
            const fetchRecentPosts = async () => {
                const response = await fetchGQL(
                    queryRecent,
                    postOpr,
                    WEEK_IN_SECONDS,
                ).catch(() => null)
                setPosts(response)
            }
            fetchRecentPosts()
        }
    }, [posts, setPosts])

    return (
        <>
            <Row>
                <Column small={12}>
                    <WidgetTitle>Recent Posts</WidgetTitle>
                </Column>
            </Row>

            {posts && posts.length && (
                <Row>
                    <Cards
                        posts={posts}
                        keyPrefix="not-found"
                        large={4}
                        medium={6}
                        small={12}
                    />
                </Row>
            )}
            {posts && !posts.length && (
                <Loading
                    className="archive"
                    counts={12}
                    large={4}
                    medium={6}
                    small={12}
                />
            )}
        </>
    )
}
