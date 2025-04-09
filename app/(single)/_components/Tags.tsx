import React from 'react'
import Link from 'next/link'
/* Helpers */
import type { T_Term } from '@app/_lib/types'

interface Props {
    items: T_Term[]
}

export const Tags = ({ items }: Props) => {
    return (
        <>
            {items.length !== 0 && (
                <ul className="tag__container">
                    {items.map((tag: T_Term, index: number) => (
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
