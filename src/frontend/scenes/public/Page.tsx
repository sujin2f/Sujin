import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'

import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'

import { Banner } from '@frontend/scenes/layout/Banner'
import { Tags } from '@frontend/components/Tags'
import { Content } from '@frontend/components/Content'
import { SocialShare } from '@frontend/components/SocialShare'
import { usePost } from '@frontend/hooks/usePost'
import { NotFound } from '@frontend/scenes/public/NotFound'

import DefaultThumbnail from '@frontend/images/thumbnail-default.png'

function Page() {
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

    document.title = post.title

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
                    <Content post={post!}>
                        <Tags items={post!.tags} />

                        <SocialShare
                            title={post!.title}
                            excerpt={post!.excerpt}
                            thumbnail={thumbnail}
                        />
                    </Content>
                </Column>
            </Row>
        </Fragment>
    )
}

export default Page
