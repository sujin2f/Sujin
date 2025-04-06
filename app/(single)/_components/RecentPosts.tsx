'use client'
import React from 'react'
/* Components */
import { Row } from '@common/components/layout/Row'
import Title from '@app/_components/WidgetTitle'
import { Cards } from '@app/(archive)/_components/cards'
import { Loading } from '@app/(archive)/_components/loading'
/* Utils */
import { useRecentPost } from '@app/_lib/hooks/useRecentPost'
/* Constants */
import { IMAGE_SIZE } from '@app/_lib/data/mysql/types'
/* Assets */
import './style.scss'

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
                        imageSize={IMAGE_SIZE.RECENT_POST}
                    />
                </Row>
            )}
        </section>
    )
}
