import React from 'react'

import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'
import { Card } from '@common/components/containers/Card'
import { WidgetTitle } from '@frontend/components/widget/WidgetTitle'

import { Post } from '@project/types/wordpress'

import DefaultThumbnail from '@frontend/images/thumbnail-default.png'

import 'src/frontend/scss/related-posts.scss'

interface Props {
    items?: Post[]
}

export const RelatedPosts = (props: Props) => {
    const { items } = props

    return (
        <section className="related-posts">
            <WidgetTitle>Related Posts</WidgetTitle>

            <Row fullWidth>
                {items &&
                    items.map((related) => (
                        <Column
                            key={`related--${related.id}`}
                            medium={6}
                            small={12}
                        >
                            <Card
                                title={related.title}
                                description={related.excerpt}
                                to={related.link}
                                time={new Date(
                                    parseInt(related.date),
                                ).getTime()}
                                image={
                                    related.images.list?.url ||
                                    related.images.thumbnail?.url ||
                                    DefaultThumbnail
                                }
                            />
                        </Column>
                    ))}
            </Row>
        </section>
    )
}
