import React from 'react'

import { Row } from '@common/components/layout/Row'
import { WidgetTitle } from '@components/WidgetTitle'
import { Post } from '@src/types/wordpress'
import { Cards } from '@components/(wordpress)/archive/cards'

import '@src/scss/related-posts.scss'

interface Props {
    items?: Post[]
}

export const RelatedPosts = (props: Props) => {
    const { items } = props

    return (
        <section className="related-posts">
            <WidgetTitle>Related Posts</WidgetTitle>

            <Row fullWidth>
                <Cards
                    posts={items || []}
                    keyPrefix="related"
                    medium={6}
                    small={12}
                />
            </Row>
        </section>
    )
}
