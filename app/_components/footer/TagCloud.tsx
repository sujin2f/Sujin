'use client'
import React from 'react'
import Link from 'next/link'
/* Components */
import { Loading } from '@app/archive/_components/Loading'
/* CONSTANTS */
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import GQL from '@app/api/graphql/_lib/constants'
/* Utils */
import useIntersectionGQL from '@common/hooks/useIntersectionGQL'

const TagCloud = () => {
    const [ref, tagCloud] = useIntersectionGQL(
        GQL.queryTagCloud,
        'id title slug total hits',
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
                        key={`tag-cloud-${tag.slug}-${tag.title}`}
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
