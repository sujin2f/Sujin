/** components/widgets/Tags */
import React from 'react'
import { useTagCloud } from 'src/frontend/hooks/useTagCloud'
import { Link } from 'src/frontend/components/Link'

export const TagCloud = (): JSX.Element => {
    const { tagCloud } = useTagCloud()

    return (
        <section className="widget--tag-cloud">
            {tagCloud.slice(0, 20).map((tag) => (
                <Link
                    className={`tag-cloud tag-cloud--size-${tag.count} tag-cloud--color-${tag.hit}`}
                    title={tag.title}
                    to={`/tag/${tag.slug}`}
                    key={`tag-${tag.id}`}
                >
                    {tag.title}
                </Link>
            ))}
        </section>
    )
}
