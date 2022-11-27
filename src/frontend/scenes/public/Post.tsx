import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'
import DEFAULT_BG from 'src/assets/images/thumbnail.svg'

import { Content } from 'src/frontend/components/Content'
import { PrevNext } from 'src/frontend/components/PrevNext'
import { RecentPosts } from 'src/frontend/components/RecentPosts'
import { RelatedPosts } from 'src/frontend/components/RelatedPosts'
import { SocialShare } from 'src/frontend/components/SocialShare'
import { Tags } from 'src/frontend/components/Tags'
import { GoogleAdvert } from 'src/frontend/components/widget'
import { NotFound } from 'src/frontend/scenes/public/NotFound'
import { usePost } from 'src/frontend/hooks/usePost'
import { Column } from 'src/common/components/layout/Column'
import { Row } from 'src/common/components/layout/Row'

export const Post = (): JSX.Element => {
    const { slug } = useParams<{ slug: string }>()
    const { post, error, loading, title } = usePost(slug)

    if (error) {
        return <NotFound />
    }

    if (loading) {
        return <Fragment />
    }

    if (!post) {
        return <NotFound />
    }

    document.title = title

    const thumbnail =
        post.images.list?.url ||
        post.images.thumbnail?.url ||
        post.images.background?.url ||
        DEFAULT_BG

    return (
        <Row>
            <Column medium={12} large={6} largeOffset={3}>
                <Content post={post}>
                    <Tags items={post.tags} prefix={`single-${slug}`} />
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
                <GoogleAdvert
                    client={window.globalVariable.adClient}
                    slot={window.globalVariable.adSlot}
                />
            </Column>
        </Row>
    )
}
