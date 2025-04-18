import React from 'react'
import Link from 'next/link'
/* Helpers */
import type { T_Archive } from '@app/_lib/types'

interface Props {
    items: T_Archive[]
}

export const Tags = ({ items }: Props) => {
    return (
        <>
            {items.length !== 0 && (
                <ul className="tag__container">
                    {items.map((tag, index) => (
                        <li key={`tag-${tag._id}-${index}`}>
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
