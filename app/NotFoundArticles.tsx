'use client'
import React from 'react'
/* Components */
import { Loading } from '@app/components/archive/loading'
import Title from '@app/components/common/WidgetTitle'
import { Cards } from '@app/components/archive/cards'
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'
/* Helpers */
import { useRecentPost } from '@app/helpers/hooks/useRecentPost'

const NotFoundArticles = (): React.ReactNode => {
    const posts = useRecentPost()
    return (
        <main>
            <Row>
                <Column small={12}>
                    <Title>Recent Posts</Title>
                </Column>
            </Row>
            {/* Loading */}
            {!posts && (
                <Loading
                    className="archive"
                    counts={12}
                    large={4}
                    medium={6}
                    small={12}
                />
            )}
            {/* Result */}
            {posts && (
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
        </main>
    )
}

export default NotFoundArticles
