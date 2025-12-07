'use client'
import React, { useRef, useState } from 'react'
/* Components */
import { WidgetTitle } from '../../../lib/components/WidgetTitle'
import { Cards } from '../../../lib/components/archive/Cards'
/* Utils */
import useIntersectionObserver from '@common/hooks/useIntersectionObserver'
import { useServerAction } from '@app/_hooks/useServerAction'
/* T_Type */
import type { T_ArchivePost } from '@sujin/lib/types'

type Props = {
    readonly action: () => Promise<T_ArchivePost[]>
}

export const RelatedPosts = ({ action }: Props) => {
    const ref = useRef(null)
    const [skip, setSkip] = useState(true)
    // Read from GraphQL
    const { loading, error, data } = useServerAction(action, skip)
    useIntersectionObserver(ref, async () => {
        setSkip(false)
    })

    if (error || loading || !data) {
        return <div ref={ref} />
    }

    const posts = {
        related: data,
        numPages: 0,
    }

    return (
        <section className="related-posts">
            <WidgetTitle>Related Posts</WidgetTitle>
            <Cards posts={posts} listKey="related" keyPrefix="related" medium={6} small={12} />
        </section>
    )
}
