import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'src/common/graphql/useQuery'
import { queryTagCloud, tagCloudOpr } from 'src/constants/graphql'

import 'src/frontend/scss/tag-cloud.scss'

export function TagCloud() {
    const { data: tagCloud } = useQuery(queryTagCloud, tagCloudOpr)

    return (
        <section className="widget--tag-cloud">
            {tagCloud &&
                tagCloud.slice(0, 20).map((tag) => (
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
