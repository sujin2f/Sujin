import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'

import { Column } from 'src/common/components/layout/Column'
import { Row } from 'src/common/components/layout/Row'

import { Banner } from 'src/frontend/scenes/layout/Banner'
import { Content } from 'src/frontend/components/Content'
import { PrevNext } from 'src/frontend/components/PrevNext'
import { RecentPosts } from 'src/frontend/components/widget/RecentPosts'
import { RelatedPosts } from 'src/frontend/components/widget/RelatedPosts'
import { SocialShare } from 'src/frontend/components/SocialShare'
import { Tags } from 'src/frontend/components/Tags'
import { GoogleAdvert } from 'src/frontend/components/widget/GoogleAdvert'
import { NotFound } from 'src/frontend/scenes/public/NotFound'
import { usePost } from 'src/frontend/hooks/usePost'

import DefaultThumbnail from 'src/frontend/images/thumbnail-default.png'

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
                        client={window.frontendVars.GOOGLE_AD_CLIENT}
                        slot={window.frontendVars.GOOGLE_AD_SLOT}
                    />
                </Column>
            </Row>
        </Fragment>
    )
}

export default Post
