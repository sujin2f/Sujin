'use client'
import React, { RefObject, useRef, useState } from 'react'
/* Components */
import { Row } from '@common/components/layout/Row'
import Title from '@components/WidgetTitle'
import { Cards } from '@app/components/archive/cards'
import { Loading } from '@app/components/archive/loading'
/* Types */
import type { PostType } from '@src/types/wordpress'
import type { Nullable } from '@common/types'
/* Utils */
import { fetchGQL } from '@common/data/graphql/fetchGQL'
import useIntersectionObserver from '@common/hooks/useIntersectionObserver'
/* Constants */
import GQL from '@src/constants/graphql'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
/* Assets */
import '@src/scss/related-posts.scss'

interface Props {
    post: PostType
}

export const RelatedPosts = (props: Props) => {
    const ref = useRef<HTMLElement>(null)
    const posts = useRelatedPosts(props.post, ref)
    return (
        <section className="related-posts" ref={ref}>
            <Title>Related Posts</Title>

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
    post: PostType,
    ref: RefObject<HTMLElement | null>,
): Nullable<PostType[]> => {
    const [posts, setPosts] = useState<Nullable<PostType[]>>()
    useIntersectionObserver(ref, () => {
        fetchGQL(GQL.queryRelatedPosts, GQL.postOpr, WEEK_IN_SECONDS, post.slug)
            .then((result) => setPosts(result))
            .catch(() => setPosts([]))
    })
    return posts
}
