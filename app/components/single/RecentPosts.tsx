import React, { use } from 'react'

import { Row } from '@common/components/layout/Row'
import { WidgetTitle } from '@app/components/WidgetTitle'
import { Term } from '@src/types/wordpress'
import { Cards } from '@app/components/archive/cards'

import '@src/scss/recent-post.scss'

type Props = {
    readonly current: number
    readonly term: Promise<Term>
}

export const RecentPosts = ({ term, current }: Props) => {
    const { posts } = use(term)

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
