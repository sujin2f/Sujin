import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'
import DEFAULT_BG from 'src/assets/images/thumbnail.svg'

import {
    Content,
    PrevNext,
    RecentPosts,
    RelatedPosts,
    SocialShare,
    Tags,
} from 'src/frontend/components'
import { GoogleAdvert } from 'src/frontend/components/widget'
import { NotFound } from 'src/frontend/scenes/public'
import { usePost } from 'src/frontend/hooks/usePost'
import { Column, Row } from 'src/common'

export const Post = (): JSX.Element => {
    const { slug } = useParams<{ slug: string }>()
    const { post, error, loading } = usePost(slug)

    if (error) {
        return <NotFound />
    }

    if (loading) {
        return <Fragment />
    }

    const thumbnail =
        post!.images.list?.url ||
        post!.images.thumbnail?.url ||
        post!.images.background?.url ||
        DEFAULT_BG

    return (
        <Row>
            <Column medium={12} large={6} largeOffset={3}>
                <Content post={post!}>
                    <Tags items={post!.tags} prefix={`single-${slug}`} />
                    <SocialShare
                        title={post!.title}
                        excerpt={post!.excerpt}
                        thumbnail={thumbnail}
                    />
                    <PrevNext prevNext={post!.prevNext} />
                    <RelatedPosts items={post!.related} />
                </Content>
            </Column>

            <Column
                small={12}
                large={3}
                className="layout__article__right"
                dom="aside"
            >
                <RecentPosts />
                <GoogleAdvert
                    client={window.globalVariable.adClient}
                    slot={window.globalVariable.adSlot}
                />
            </Column>
        </Row>
    )
}
