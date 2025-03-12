import React from 'react'
/* Components */
import { Tags } from '@components/wordpress/single/Tags'
import { PrevNextWithPost } from '@components/wordpress/single/PrevNext'
import { RelatedPosts } from '@components/wordpress/single/RelatedPosts'
import { RecentPosts } from '@components/wordpress/single/RecentPosts'
import GoogleAdvert from '@components/GoogleAdvert'
import { SocialShare } from '@components/wordpress/single/SocialShare'
import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'
import { Content } from '@components/wordpress/single/Content'
import ScrollToTop from '@components/ScrollToTop'
/* Helpers */
import type { Post as PostType } from '@src/types/wordpress'

type Props = {
    post: PostType
    thumbnail: string
}

export const Post = ({ post, thumbnail }: Props) => {
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
                    <PrevNextWithPost post={post} />
                    <RelatedPosts post={post} />
                </Content>
            </Column>

            <Column
                small={12}
                large={3}
                className="layout__article__right"
                dom="aside"
            >
                <RecentPosts current={post.id} />
                <GoogleAdvert responsive place="sidebar" />
            </Column>
        </Row>
    )
}
