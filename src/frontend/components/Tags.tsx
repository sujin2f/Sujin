/*
 * Tags Component
 * components/common/Tags
 */

import React from 'react'

import { Link } from 'src/frontend/components/Link'
import { Term } from 'src/types/wordpress'

interface Props {
    items: Term[]
    prefix: string
}

export const Tags = (props: Props): JSX.Element => {
    return (
        <ul className="tag__container">
            {props.items &&
                props.items.map((tag: Term) => (
                    <li key={`tag-${props.prefix}-${tag.slug}`}>
                        <Link to={`/tag/${tag.slug}/page/1`} className="tag">
                            {tag.title}
                        </Link>
                    </li>
                ))}
        </ul>
    )
}
