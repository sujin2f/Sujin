'use client'
import React, { RefObject, useRef, useState } from 'react'
/* Components */
import { Row } from '@common/components/layout/Row'
import { WidgetTitle } from '@app/_components/WidgetTitle'
import { Cards } from '@app/_components/archive/cards'
import { Loading } from '@app/_components/archive/loading'
/* T_Types */
import type { T_Post, T_PostArchive } from '@app/_lib/types'
import type { Nullable } from '@common/types'
/* Utils */
import { fetchGQL } from '@common/data/graphql/fetchGQL'
import useIntersectionObserver from '@common/hooks/useIntersectionObserver'
/* CONSTANTS */
import GQL from '@app/api/graphql/constants'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
/* Assets */
import './style.scss'

interface Props {
    post: T_Post
}

export const RelatedPosts = (props: Props) => {
    const ref = useRef<HTMLElement>(null)
    const posts = useRelatedPosts(props.post, ref)
    return (
        <section className="related-posts" ref={ref}>
            <WidgetTitle>Related Posts</WidgetTitle>

            {/* Loading */}
            {!posts && <Loading counts={4} small={12} medium={6} fullWidth />}
            <Row fullWidth>
                {/* Result */}
                {posts && (
                    <Cards
                        posts={posts}
                        keyPrefix="related"
                        medium={6}
                        small={12}
                    />
                )}
            </Row>
        </section>
    )
}

const useRelatedPosts = (
    post: T_Post,
    ref: RefObject<HTMLElement | null>,
): Nullable<T_PostArchive[]> => {
    const [posts, setPosts] = useState<Nullable<T_PostArchive[]>>()
    useIntersectionObserver(ref, () => {
        fetchGQL(GQL.queryRelatedPosts, GQL.postOpr, WEEK_IN_SECONDS, post.slug)
            .then((result) => setPosts(result))
            .catch(() => setPosts([]))
    })
    return posts
}
