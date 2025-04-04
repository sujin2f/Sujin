'use client'
import React from 'react'
import Link from 'next/link'
/* Components */
import { Loading } from '@app/components/archive/loading'
/* Constants */
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import GQL from '@src/constants/graphql'
/* Utils */
import useIntersectionGQL from '@common/hooks/useIntersectionGQL'
/* Assets */
import '@src/scss/tag-cloud.scss'

const TagCloud = () => {
    const [ref, tagCloud] = useIntersectionGQL(
        GQL.queryTagCloud,
        GQL.tagCloudOpr,
        WEEK_IN_SECONDS,
    )

    return (
        <section className="widget--tag-cloud" ref={ref}>
            {!tagCloud && (
                <Loading
                    fullWidth
                    className="tag-cloud"
                    counts={1}
                    small={12}
                />
            )}
            {tagCloud &&
                tagCloud.slice(0, 20).map((tag) => (
                    <Link
                        className={`tag-cloud tag-cloud--size-${tag.total} tag-cloud--color-${tag.hits}`}
                        key={`tag-cloud-${tag.id}-${tag.title}-${tag.slug}`}
                        title={tag.title}
                        href={`/tag/${tag.slug}`}
                    >
                        {tag.title}
                    </Link>
                ))}
        </section>
    )
}

export default TagCloud
