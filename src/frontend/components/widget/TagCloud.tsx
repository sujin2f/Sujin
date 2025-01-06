import React from 'react'
import { Link } from 'react-router-dom'

import { useTagCloud } from 'src/frontend/hooks/useTagCloud'
import 'src/frontend/scss/tag-cloud.scss'

export function TagCloud() {
    const { tagCloud } = useTagCloud()

    return (
        <section className="widget--tag-cloud">
            {tagCloud.slice(0, 20).map((tag) => (
                <Link
                    className={`tag-cloud tag-cloud--size-${tag.count} tag-cloud--color-${tag.hit}`}
                    key={`tag-${tag.id}`}
                    title={tag.title}
                    to={`/tag/${tag.slug}`}
                >
                    {tag.title}
                </Link>
            ))}
        </section>
    )
}
