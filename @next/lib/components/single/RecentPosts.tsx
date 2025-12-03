'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
/* Module */
import { RootState } from '@lib/store'
/* Components */
import { WidgetTitle } from '@lib/components/WidgetTitle'
import { Cards } from '@lib/components/archive/Cards'
import { LoadingArchive } from '@lib/components/archive/LoadingArchive'
/* Utils */
import { setRecent } from '@lib/store/slices/recent'
import { useServerAction } from '@lib/hooks/useServerAction'
import useIntersectionObserver from '@common/hooks/useIntersectionObserver'
/* CONSTANTS */
import { IMAGE_SIZE } from '@sujin/lib/constants'
/* T_Types */
import type { T_ArchivePost } from '@sujin/lib/types'
/* Assets */
import './RecentPosts.scss'

type Props = {
    id: number
    readonly action: () => Promise<T_ArchivePost[]>
}

export const RecentPosts = ({ id, action }: Props) => {
    // Redux store
    const recent = useSelector((state: RootState) => state.recent)
    const dispatch = useDispatch()
    const hasStore = useMemo(() => !!recent.length, [recent])

    // Read from GraphQL with Intersection Observer & update store
    const ref = useRef(null)
    const [skip, setSkip] = useState(true)
    // Read from GraphQL
    const { loading, error, data } = useServerAction(action, skip || hasStore)

    useEffect(() => {
        if (!hasStore && data && data.length) {
            dispatch(setRecent(data))
        }
    }, [data, hasStore, dispatch])
    useIntersectionObserver(ref, async () => {
        setSkip(false)
    })

    // Data is not yet ready
    if (!hasStore && (error || !data)) {
        return <div ref={ref} />
    }

    if (loading) {
        return <LoadingArchive small={12} counts={4} />
    }

    const list = recent.filter((post) => post.id !== id).slice(0, 4)

    return (
        <section className="recent-posts show-for-large">
            <WidgetTitle>Recent Posts</WidgetTitle>
            <Cards
                posts={{ list, numPages: 0 }}
                keyPrefix="recent"
                listKey="list"
                imageSize={[IMAGE_SIZE.RECENT_POST]}
            />
        </section>
    )
}
