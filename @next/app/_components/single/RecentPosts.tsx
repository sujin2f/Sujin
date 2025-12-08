'use client'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
/* Module */
import { RootState } from '@app/_store'
/* Components */
import { WidgetTitle } from '@app/_components/WidgetTitle'
import Card from '@common/components/containers/Card'
import { LoadingArchive } from '@lib/components/archive/LoadingArchive'
/* Utils */
import { setRecent } from '@app/_store/slices/recent'
import { useServerAction } from '@app/_hooks/useServerAction'
import useIntersectionObserver from '@common/hooks/useIntersectionObserver'
/* T_Types */
import type { T_ArchivePost } from '@sujin/lib/types'

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
        <section aria-label="Recent Posts">
            <WidgetTitle>Recent Posts</WidgetTitle>

            <ul className="recent-posts grid grid-cols-1 gap-4">
                {list.map((post: T_ArchivePost, index: number) => {
                    const url = post.images && (post.images.list?.url || post.images.thumbnail?.url)
                    const picture = (
                        <Image
                            src={url || '/assets/thumbnail.png'}
                            alt={post.title}
                            loading="lazy"
                            width={400}
                            height={300}
                            className="w-full h-full object-cover object-center"
                        />
                    )

                    return (
                        <Card
                            key={`card-recent-${index}-${post._id}`}
                            title={post.title}
                            description={post.excerpt}
                            to={post.link}
                            timestamp={post.date}
                            ratio="aspect-square"
                            picture={picture}
                            image=""
                        />
                    )
                })}
            </ul>
        </section>
    )
}
