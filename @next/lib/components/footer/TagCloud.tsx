'use client'
import Link from 'next/link'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
/* Components */
import { LoadingArchive } from '@lib/components/archive/LoadingArchive'
/* Store */
import { setTagCloud } from '@lib/store/slices/tag-cloud'
import { RootState } from '@lib/store'
/* Utils */
import useIntersectionObserver from '@common/hooks/useIntersectionObserver'
import { useServerAction } from '@lib/hooks/useServerAction'
/* T_Type */
import type { T_Archive } from '@sujin/lib/types'

type Props = {
    readonly action: () => Promise<T_Archive[]>
}

const TagCloud = ({ action }: Props) => {
    // Redux store
    const tagCloud = useSelector((state: RootState) => state.tagCloud)
    const dispatch = useDispatch()
    const hasStore = useMemo(() => !!tagCloud.length, [tagCloud])

    const ref = useRef(null)
    const [skip, setSkip] = useState(true)
    // Read from GraphQL
    const { loading, error, data } = useServerAction(action, skip || hasStore)
    useEffect(() => {
        if (!hasStore && data && data.length) {
            dispatch(setTagCloud(data))
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
        <div className="tag-cloud__container" ref={ref}>
            {loading && <LoadingArchive fullWidth className="tag-cloud" counts={1} small={12} />}
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
        </div>
    )
}
export default TagCloud
