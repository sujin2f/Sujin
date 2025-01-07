import React from 'react'
import { Link } from 'react-router-dom'

import { Term } from 'src/types/wordpress'

import 'src/frontend/scss/tags.scss'

interface Props {
    items: Term[]
}

export const Tags = (props: Props) => {
    const { items } = props

    return (
        <ul className="tag__container">
            {items &&
                items.map((tag: Term, index: number) => (
                    <li key={`tag-${index}-${tag.slug}`}>
                        <Link to={`/tag/${tag.slug}/page/1`} className="tag">
                            {tag.title}
                        </Link>
                    </li>
                ))}
        </ul>
    )
}
