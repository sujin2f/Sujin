'use client'

import React, { Suspense } from 'react'

import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'
import { SocialShare } from '@app/components/single/SocialShare'
import { Post } from '@src/types/wordpress'
import { Content } from '@app/components/single/Content'
import { ScrollToTop } from '@app/components/ScrollToTop'

type Props = {
    post: Post
    thumbnail: string
}

export const Page = ({ post, thumbnail }: Props) => {
    return (
        <Row>
            <ScrollToTop />
            <Column medium={12} large={8} largeOffset={2}>
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
