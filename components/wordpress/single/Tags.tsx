import React from 'react'
import Link from 'next/link'
/* Helpers */
import type { Term } from '@src/types/wordpress'
/* Assets */
import '@src/scss/tags.scss'

interface Props {
    items: Term[]
}

export const Tags = (props: Props) => {
    return (
        <>
            {props.items.length !== 0 && (
                <ul className="tag__container">
                    {props.items.map((tag: Term, index: number) => (
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
        </>
    )
}
