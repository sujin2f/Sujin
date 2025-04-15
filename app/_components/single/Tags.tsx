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
                    {items.map((tag: T_Archive, index: number) => (
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
