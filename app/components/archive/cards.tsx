'use client'
import React from 'react'
/* Components */
import { ARCHIVE, type PostType } from '@src/types/wordpress'
import { Column, OneToTwelve } from '@common/components/layout/Column'
import { Card } from '@common/components/containers/Card'
import { Tags } from '@app/components/single/Tags'
/* Helpers */
import { getThumbnailFromPost } from '@src/utils/wordpress'

type Props = {
    readonly posts: PostType[]
    readonly keyPrefix: string
    readonly large?: OneToTwelve
    readonly medium?: OneToTwelve
    readonly small?: OneToTwelve
}

export const Cards = ({ posts, keyPrefix, large, medium, small }: Props) => {
    return posts.map((post: PostType, index: number) => {
        const tags = post.terms.filter((term) => term.type === ARCHIVE.TAG)
        return (
            <Column
                key={`card-${keyPrefix}-${index}-${post.id}`}
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
                    <Tags items={tags} />
                </Card>
            </Column>
        )
    })
}
