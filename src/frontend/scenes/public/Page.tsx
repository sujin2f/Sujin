import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'

import { Column } from 'src/common/components/layout/Column'
import { Row } from 'src/common/components/layout/Row'

import { Banner } from 'src/frontend/scenes/layout/Banner'
import { Tags } from 'src/frontend/components/Tags'
import { Content } from 'src/frontend/components/Content'
import { SocialShare } from 'src/frontend/components/SocialShare'
import { usePost } from 'src/frontend/hooks/usePost'
import { NotFound } from 'src/frontend/scenes/public/NotFound'

import DefaultThumbnail from 'src/frontend/images/thumbnail-default.png'

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
