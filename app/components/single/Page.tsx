'use client'

import React, { Suspense } from 'react'

import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'
import { SocialShare } from '@app/components/single/SocialShare'
import { Post } from '@src/types/wordpress'
import { Content } from '@app/components/single/Content'

type Props = {
    post: Post
    thumbnail: string
}

export const Page = ({ post, thumbnail }: Props) => {
    return (
        <Row>
            <Column medium={12} large={6} largeOffset={3}>
                <Suspense>
                    <Content post={post}>
                        <SocialShare
                            title={post.title}
                            excerpt={post.excerpt}
                            thumbnail={thumbnail}
                        />
                    </Content>
                </Suspense>
            </Column>
        </Row>
    )
}
