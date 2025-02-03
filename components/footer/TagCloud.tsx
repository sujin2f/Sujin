'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
/* Components */
import { Loading } from '@components/wordpress/archive/loading'
/* Helpers */
import { fetchGQL } from '@common/data/graphql/fetchGQL'
import { queryTagCloud, tagCloudOpr } from '@src/constants/graphql'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import type { TagCloud as TagCloudType } from '@src/types/wordpress'
import type { Nullable } from '@common/types'
/* Assets */
import '@src/scss/tag-cloud.scss'

export default function TagCloud() {
    const tagCloud = useTagCloud()

    if (!tagCloud) {
        return <Loading fullWidth className="tag-cloud" counts={1} small={12} />
    }

    return (
        <section className="widget--tag-cloud">
            {tagCloud.slice(0, 20).map((tag) => (
                <Link
                    className={`tag-cloud tag-cloud--size-${tag.count} tag-cloud--color-${tag.hit}`}
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

const useTagCloud = () => {
    const [tagCloud, setTagCloud] = useState<Nullable<TagCloudType[]>>()
    useEffect(() => {
        fetchGQL(queryTagCloud, tagCloudOpr, WEEK_IN_SECONDS)
            .then((result) => setTagCloud(result))
            .catch(() => setTagCloud([]))
    }, [])
    return tagCloud
}
