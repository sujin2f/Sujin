'use client'
import React from 'react'
/* Components */
import type { Post } from '@src/types/wordpress'
import { Column, OneToTwelve } from '@common/components/layout/Column'
import { Card } from '@common/components/containers/Card'
import { Tags } from '@components/wordpress/single/Tags'
/* Helpers */
import { getThumbnailFromPost } from '@src/utils/wordpress'

type Props = {
    readonly posts: Post[]
    readonly keyPrefix: string
    readonly large?: OneToTwelve
    readonly medium?: OneToTwelve
    readonly small?: OneToTwelve
}

export const Cards = ({ posts, keyPrefix, large, medium, small }: Props) => {
    return posts.map((post: Post) => (
        <Column
            key={`card-${keyPrefix}-${post.id}`}
            large={large}
            medium={medium}
            small={small}
        >
            <Card
                title={post.title}
                description={post.excerpt}
                to={post.link}
                time={post.date}
                image={getThumbnailFromPost(post)}
            >
                {post.tags && <Tags items={post.tags} />}
            </Card>
        </Column>
    ))
}
