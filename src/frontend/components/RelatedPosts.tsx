import React from 'react'
import { Column } from 'src/common/components/layout/Column'
import { Row } from 'src/common/components/layout/Row'

import { ListItem } from 'src/frontend/components/ListItem'
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
                            <ListItem item={related} />
                        </Column>
                    ))}
            </Row>
        </section>
    )
}
