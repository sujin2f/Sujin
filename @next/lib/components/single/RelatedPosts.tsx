'use client'
import React, { useRef, useState } from 'react'
import { useQuery } from '@apollo/client/react'
/* Modules */
import { client } from '@lib/apollo/apollo-client-frontend'
/* Components */
import { WidgetTitle } from '../WidgetTitle'
import { Cards } from '../archive/Cards'
/* Utils */
import useIntersectionObserver from '@common/hooks/useIntersectionObserver'
/* CONSTANTS */
import RELATED_QUERY from '@lib/apollo/queries/wordpress/posts/related.graphql'
/* T_Type */
import type { T_ArchivePost } from '@sujin/lib/types'
/* Assets */
import './RelatedPosts.scss'

type Props = {
    slug: string
}

export const RelatedPosts = ({ slug }: Props) => {
    const ref = useRef(null)
    const [skip, setSkip] = useState(true)
    const { loading, error, data } = useQuery<{ related: T_ArchivePost[] }>(
        RELATED_QUERY,
        { skip, client, variables: { slug } },
    )
    useIntersectionObserver(ref, async () => {
        setSkip(false)
    })

    if (error || loading || !data) {
        return <div ref={ref} />
    }

    const posts = {
        related: data.related,
        numPages: 0,
    }

    return (
        <section className="related-posts">
            <WidgetTitle>Related Posts</WidgetTitle>
            <Cards
                posts={posts}
                listKey="related"
                keyPrefix="related"
                medium={6}
                small={12}
            />
        </section>
    )
}
