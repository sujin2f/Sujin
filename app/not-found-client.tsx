'use client'
import React from 'react'
/* Components */
import { Loading } from '@app/_components/archive/loading'
import { WidgetTitle } from '@app/_components/WidgetTitle'
import { Cards } from '@app/_components/archive/cards'
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'
/* Helpers */
import { useRecentPost } from '@app/_lib/hooks/useRecentPost'

export const NotFoundClient = (): React.ReactNode => {
    const posts = useRecentPost()
    return (
        <main>
            <Row>
                <Column small={12}>
                    <WidgetTitle>Recent Posts</WidgetTitle>
                </Column>
            </Row>
            {posts ? (
                <Row>
                    <Cards
                        posts={posts}
                        keyPrefix="not-found"
                        large={4}
                        medium={6}
                        small={12}
                    />
                </Row>
            ) : (
                <Loading
                    className="archive"
                    counts={12}
                    large={4}
                    medium={6}
                    small={12}
                />
            )}
        </main>
    )
}
