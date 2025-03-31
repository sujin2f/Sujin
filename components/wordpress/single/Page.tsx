import React from 'react'
/* Components */
import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'
import { SocialShare } from '@components/wordpress/single/SocialShare'
import { Content } from '@components/wordpress/single/Content'
import ScrollToTop from '@components/ScrollToTop'
/* Helpers */
import type { Post } from '@src/types/wordpress'

type Props = {
    post: Post
    thumbnail: string
}

const Page = ({ post, thumbnail }: Props) => {
    return (
        <Row>
            <ScrollToTop />
            <Column medium={12} large={8} largeOffset={2}>
                <Content post={post}>
                    <SocialShare
                        title={post.title}
                        excerpt={post.excerpt}
                        thumbnail={thumbnail}
                    />
                </Content>
            </Column>
        </Row>
    )
}

export default Page
