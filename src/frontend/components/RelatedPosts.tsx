import React from 'react'
import { Column } from 'src/common/components/layout/Column'
import { Row } from 'src/common/components/layout/Row'
import { Card } from 'src/common/components/containers/Card'

import { Post } from 'src/types/wordpress'

interface Props {
    items?: Post[]
}

export const RelatedPosts = (props: Props): JSX.Element => {
    return (
        <section className="related-posts">
            <h2 className="section-header">
                <span>Related Posts</span>
            </h2>

            <Row dom="section">
                {props.items &&
                    props.items.map((related) => (
                        <Column
                            key={`related--${related.id}`}
                            medium={6}
                            small={12}
                        >
                            <Card
                                title={related.title}
                                description={related.excerpt}
                                to={related.link}
                                time={new Date(related.date)}
                                image={
                                    related.images.list ||
                                    related.images.thumbnail
                                }
                            />
                        </Column>
                    ))}
            </Row>
        </section>
    )
}
