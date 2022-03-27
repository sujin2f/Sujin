/*
 * Post Component
 * scenes/public/Post
 * domain.com/2020/01/01/slug
 */

import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'
import DEFAULT_BG from 'src/assets/images/thumbnail.svg'

import {
    Content,
    GoogleAdvert,
    SocialShare,
    Tags,
} from 'src/frontend/components'
import { NotFound } from 'src/frontend/scenes/public'
import { usePost } from 'src/frontend/hooks/usePost'

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
        <Fragment>
            <div className="columns medium-12 large-2" />
            <Content post={post!} className="columns large-8 medium-12">
                <Tags items={post!.tags} prefix={`single-${slug}`} />
                <SocialShare
                    title={post!.title}
                    excerpt={post!.excerpt}
                    thumbnail={thumbnail}
                />
                {/* <PrevNext prevNext={prevNext} />
                <RelatedPosts items={related} /> */}
            </Content>

            <aside className="columns small-12 large-3 layout__article__right">
                <GoogleAdvert
                    client={window.globalVariable.adClient}
                    slot={window.globalVariable.adSlot}
                />
            </aside>
        </Fragment>
    )
}
