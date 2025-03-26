'use client'
import React, { RefObject, useRef, useState } from 'react'
/* Components */
import { Row } from '@common/components/layout/Row'
import Title from '@components/WidgetTitle'
import { Cards } from '@components/wordpress/archive/cards'
import { Loading } from '@components/wordpress/archive/loading'
/* Types */
import type { Post } from '@src/types/wordpress'
import type { Nullable } from '@common/types'
/* Utils */
import { fetchGQL } from '@common/data/graphql/fetchGQL'
import useIntersectionObserver from '@common/hooks/useIntersectionObserver'
/* Constants */
import { postOpr, queryRelatedPosts } from '@src/constants/graphql'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
/* Assets */
import '@src/scss/related-posts.scss'

interface Props {
    post: Post
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
    post: Post,
    ref: RefObject<HTMLElement | null>,
): Nullable<Post[]> => {
    const [posts, setPosts] = useState<Nullable<Post[]>>()
    useIntersectionObserver(ref, () => {
        fetchGQL(
            queryRelatedPosts,
            postOpr,
            WEEK_IN_SECONDS,
            post.id,
            post.categories.map((category) => category.slug).join(','),
            post.tags.map((tag) => tag.slug).join(','),
        )
            .then((result) => setPosts(result))
            .catch(() => setPosts([]))
    })
    return posts
}
