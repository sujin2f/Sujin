import React, { Fragment } from 'react'
import Link from 'next/link'

import { Term } from '@src/types/wordpress'

import '@src/scss/tags.scss'

interface Props {
    items: Term[]
}

export const Tags = (props: Props) => {
    const { items } = props

    return (
        <Fragment>
            {items && items.length !== 0 && (
                <ul className="tag__container">
                    {items.map((tag: Term, index: number) => (
                        <li key={`tag-${index}-${tag.slug}`}>
                            <Link
                                href={`/tag/${tag.slug}/page/1`}
                                className="tag"
                            >
                                {tag.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </Fragment>
    )
}
