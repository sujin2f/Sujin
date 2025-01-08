import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'

import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'

import { Banner } from '@frontend/scenes/layout/Banner'
import { Content } from '@frontend/components/Content'
import { PrevNext } from '@frontend/components/PrevNext'
import { RecentPosts } from '@frontend/components/widget/RecentPosts'
import { RelatedPosts } from '@frontend/components/widget/RelatedPosts'
import { SocialShare } from '@frontend/components/SocialShare'
import { Tags } from '@frontend/components/Tags'
import { GoogleAdvert } from '@frontend/components/widget/GoogleAdvert'
import { NotFound } from '@frontend/scenes/public/NotFound'
import { usePost } from '@frontend/hooks/usePost'

import DefaultThumbnail from '@frontend/images/thumbnail-default.png'

function Post() {
    const { slug } = useParams<{ slug: string }>()
    const { post, loading, error } = usePost({
        slug: encodeURIComponent(slug || ''),
    })

    if (error) {
        return <NotFound />
    }

    if (loading) {
        return <Fragment />
    }

    if (!post) {
        return <NotFound />
    }

    const thumbnail =
        post.images.list?.url || post.images.thumbnail?.url || DefaultThumbnail

    return (
        <Fragment>
            <Banner
                title={post.title}
                excerpt={post.excerpt}
                background={post.images.background}
                icon={post.images.icon}
            />
            <Row>
                <Column medium={12} large={6} largeOffset={3}>
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
                    <GoogleAdvert
                        client={window.sujin.GOOGLE_AD_CLIENT}
                        slot={window.sujin.GOOGLE_AD_SLOT}
                    />
                </Column>
            </Row>
        </Fragment>
    )
}

export default Post
