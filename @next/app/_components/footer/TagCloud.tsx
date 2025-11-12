'use client'
import React from 'react'
import Link from 'next/link'
/* Components */
import { Loading } from '../../../.backup/archive/_components/Loading'
/* CONSTANTS */
import { WEEK_IN_SECONDS } from '@sujin/share/constants/datetime'
import GQL from '../../../.backup/api/graphql/_lib/constants'
import { Context } from '@app/_lib/constants.store'
/* Utils */
import useIntersectionGQLStore from '@sujin/common/hooks/useIntersectionGQLStore'

const TagCloud = () => {
    const { items, pending, error, ref } = useIntersectionGQLStore(
        'tagCloud',
        Context,
        GQL.queryTagCloud,
        'id title slug total hits',
        WEEK_IN_SECONDS,
    )

    if (error) {
        return
    }

    return (
        <section className="widget--tag-cloud" ref={ref}>
            {pending && (
                <Loading
                    fullWidth
                    className="tag-cloud"
                    counts={1}
                    small={12}
                />
            )}
            {items.length &&
                items.slice(0, 20).map((tag) => (
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
