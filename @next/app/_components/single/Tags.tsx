import React from 'react'
import Link from 'next/link'
/* T_Types */
import type { T_Archive } from '@sujin/lib/types'

interface Props {
    items: T_Archive[]
}

export const Tags = ({ items }: Props) => {
    return (
        <>
            {items.length !== 0 && (
                <ul className="flex flex-wrap mt-2">
                    {items.map((tag, index) => (
                        <li
                            key={`tag-${tag._id}-${index}`}
                            className="bg-secondary text-white px-2 py-0.5 mr-2 mb-2 hover:bg-secondary-dark"
                        >
                            <Link href={`/tag/${tag.slug}/page/1`}>{tag.title}</Link>
                        </li>
                    ))}
                </ul>
            )}
        </>
    )
}
