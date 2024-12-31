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

import DeafultThumbnail from 'src/frontend/images/thumbnail-default.svg'

const Page = (): JSX.Element => {
    const { slug } = useParams<{ slug: string }>()
    const { post, loading, error, title } = usePost(slug)

    if (error) {
        return <NotFound />
    }

    if (loading) {
        return <Fragment />
    }

    document.title = title

    //const thumbnail =
    //    post!.images.list?.url ||
    //    post!.images.thumbnail?.url ||
    //    post!.images.background?.url ||
    //    DeafultThumbnail

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
                        <Tags items={post!.tags} prefix={`single-${slug}`} />

                        {/*<SocialShare
                        title={post!.title}
                        excerpt={post!.excerpt}
                        thumbnail={thumbnail}
                    />*/}
                    </Content>
                </Column>
            </Row>
        </Fragment>
    )
}

export default Page
