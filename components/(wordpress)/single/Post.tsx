import React from 'react'

import { Tags } from '@components/(wordpress)/single/Tags'
import { PrevNext } from '@components/(wordpress)/single/PrevNext'
import { RelatedPosts } from '@components/(wordpress)/single/RelatedPosts'
import { RecentPosts } from '@components/(wordpress)/single/RecentPosts'
import { GoogleAdvert } from '@components/GoogleAdvert'
import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'
import { SocialShare } from '@components/(wordpress)/single/SocialShare'
import { Content } from '@components/(wordpress)/single/Content'
import { ScrollToTop } from '@components/ScrollToTop'
import { Post as PostType } from '@src/types/wordpress'

export const Post = ({
    post,
    thumbnail,
}: {
    post: PostType
    thumbnail: string
}) => {
    return (
        <Row>
            <ScrollToTop />
            <Column medium={12} large={7} largeOffset={2}>
                <Content post={post}>
                    <Tags items={post.tags} />
                    <SocialShare
                        title={post.title}
                        excerpt={post.excerpt}
                        thumbnail={thumbnail}
                    />
                    <PrevNext prevNext={post.prevNext} />
                    <RelatedPosts items={post.related} />
                </Content>
            </Column>

            <Column
                small={12}
                large={3}
                className="layout__article__right"
                dom="aside"
            >
                <RecentPosts current={post.id} />
                <GoogleAdvert />
            </Column>
        </Row>
    )
}
