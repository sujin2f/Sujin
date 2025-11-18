'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useQuery } from '@apollo/client/react'
/* Module */
import { RootState } from '@lib/store'
/* Components */
import { WidgetTitle } from '@lib/components/WidgetTitle'
import { Cards } from '@lib/components/archive/Cards'
import { LoadingArchive } from '@lib/components/archive/LoadingArchive'
/* Utils */
import { setRecent } from '@lib/store/slices/recent'
import useIntersectionObserver from '@common/hooks/useIntersectionObserver'
/* CONSTANTS */
import { IMAGE_SIZE } from '@sujin/lib/constants'
import RECENT_QUERY from '@lib/apollo/queries/wordpress/posts/recent.graphql'
/* T_Types */
import type { T_ArchivePost } from '@sujin/lib/types'
/* Assets */
import './RecentPosts.scss'

type Props = {
    id: number
}

export const RecentPosts = ({ id }: Props) => {
    // Redux store
    const recent = useSelector((state: RootState) => state.recent)
    const dispatch = useDispatch()
    const hasStore = useMemo(() => !!recent.length, [recent])

    // Read from GraphQL with Intersection Observer & update store
    const ref = useRef(null)
    const [skip, setSkip] = useState(true)
    const { loading, error, data } = useQuery<{ recent: T_ArchivePost[] }>(
        RECENT_QUERY,
        { skip: skip || hasStore },
    )

    useEffect(() => {
        if (!hasStore && data && data.recent.length) {
            dispatch(setRecent(data.recent))
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
                imageSize={IMAGE_SIZE.RECENT_POST}
            />
        </section>
    )
}
