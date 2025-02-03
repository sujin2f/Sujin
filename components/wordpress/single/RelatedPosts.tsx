import React from 'react'
/* Components */
import { Row } from '@common/components/layout/Row'
import Title from '@components/WidgetTitle'
import { Cards } from '@components/wordpress/archive/cards'
/* Helpers */
import type { Post } from '@src/types/wordpress'
/* Assets */
import '@src/scss/related-posts.scss'

interface Props {
    items: Post[]
}

export const RelatedPosts = (props: Props) => (
    <section className="related-posts">
        <Title>Related Posts</Title>

        <Row fullWidth>
            <Cards
                posts={props.items}
                keyPrefix="related"
                medium={6}
                small={12}
            />
        </Row>
    </section>
)
