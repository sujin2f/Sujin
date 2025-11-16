'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { useDispatch, useSelector } from 'react-redux'
/* Components */
import { LoadingArchive } from '@lib/components/archive/LoadingArchive'
/* Store */
import { setTagCloud } from '@lib/store/slices/tag-cloud'
import { RootState } from '@lib/store'
/* Utils */
import useIntersectionObserver from '@common/hooks/useIntersectionObserver'
/* CONSTANTS */
import TAGCLOUD_QUERY from '@lib/constants/gql/tagCloud.graphql'
/* T_Type */
import type { T_Archive } from '@sujin/lib/types'
import Link from 'next/link'

const TagCloud = () => {
    // Redux store
    const tagCloud = useSelector((state: RootState) => state.tagCloud)
    const dispatch = useDispatch()
    const hasStore = useMemo(() => !!tagCloud.length, [tagCloud])

    // Read from GraphQL with Intersection Observer & update store
    const ref = useRef(null)
    const [skip, setSkip] = useState(true)
    const { loading, error, data } = useQuery<{ tagCloud: T_Archive[] }>(
        TAGCLOUD_QUERY,
        { skip: skip || hasStore },
    )
    useEffect(() => {
        if (!hasStore && data && data.tagCloud.length) {
            dispatch(setTagCloud(data.tagCloud))
        }
    }, [data, hasStore, dispatch])
    useIntersectionObserver(ref, async () => {
        setSkip(false)
    })

    // Data is not yet ready
    if (!hasStore && (error || !data)) {
        return <div ref={ref} />
    }

    return (
        <section className="widget--tag-cloud" ref={ref}>
            {loading && (
                <LoadingArchive
                    fullWidth
                    className="tag-cloud"
                    counts={1}
                    small={12}
                />
            )}
            {tagCloud.slice(0, 20).map((tag) => (
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
