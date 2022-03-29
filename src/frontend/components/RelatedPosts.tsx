import React from 'react'
import { Column, Row } from 'src/common'

import { ListItem } from 'src/frontend/components'
import { Post } from 'src/types'

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
                            <ListItem item={related} />
                        </Column>
                    ))}
            </Row>
        </section>
    )
}
