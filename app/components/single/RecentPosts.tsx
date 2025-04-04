'use client'
import React from 'react'
/* Components */
import { Row } from '@common/components/layout/Row'
import Title from '@app/components/common/WidgetTitle'
import { Cards } from '@app/components/archive/cards'
import { Loading } from '@app/components/archive/loading'
/* Helpers */
import { useRecentPost } from '@app/helpers/hooks/useRecentPost'
/* Assets */
import '@src/scss/recent-post.scss'

export const RecentPosts = ({ current }: { current: number }) => {
    const posts = useRecentPost()
    return (
        <section className="recent-posts show-for-large">
            <Title>Recent Posts</Title>
            {/* Loading */}
            {!posts && (
                <Loading className="recent" counts={4} small={12} fullWidth />
            )}
            {/* Result */}
            {posts && (
                <Row fullWidth>
                    <Cards
                        posts={posts
                            .filter((item) => item.id !== current)
                            .slice(0, 4)}
                        keyPrefix="recent"
                    />
                </Row>
            )}
        </section>
    )
}
