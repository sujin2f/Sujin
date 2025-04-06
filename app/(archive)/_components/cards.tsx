'use client'
import React from 'react'
/* Components */
import { Column, type OneToTwelve } from '@common/components/layout/Column'
import { Card } from '@common/components/containers/Card'
import { Tags } from '@app/(single)/_components/Tags'
/* Helpers */
import { IMAGE_SIZE, type PostType } from '@app/_lib/data/mysql/types'
import { getThumbnailFromPost } from '@app/_lib/data/mysql/utils'
import { ARCHIVE } from '@app/_lib/data/types'

type Props = {
    readonly posts: PostType[]
    readonly keyPrefix: string
    readonly large?: OneToTwelve
    readonly medium?: OneToTwelve
    readonly small?: OneToTwelve
    readonly imageSize?: IMAGE_SIZE
}

export const Cards = ({
    posts,
    keyPrefix,
    large,
    medium,
    small,
    imageSize = IMAGE_SIZE.POST_THUMBNAIL,
}: Props) => {
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
                    image={getThumbnailFromPost(post, imageSize)}
                >
                    <Tags items={tags} />
                </Card>
            </Column>
        )
    })
}
