import React from 'react'
import Link from 'next/link'

import { useTagCloud } from '@src/hooks/useTagCloud'

import '@src/scss/tag-cloud.scss'

export function TagCloud() {
    const { tagCloud } = useTagCloud()

    return (
        <section className="widget--tag-cloud">
            {tagCloud &&
                tagCloud.slice(0, 20).map((tag) => (
                    <Link
                        className={`tag-cloud tag-cloud--size-${tag.count} tag-cloud--color-${tag.hit}`}
                        key={`tag-${tag.id}`}
                        title={tag.title}
                        href={`/tag/${tag.slug}`}
                    >
                        {tag.title}
                    </Link>
                ))}
        </section>
    )
}
