/*
 * Post Component
 * scenes/public/Post
 * domain.com/2020/01/01/slug
 */

import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'
import DEFAULT_BG from 'src/assets/images/thumbnail.svg'

import { Content, SocialShare, Tags } from 'src/frontend/components'
import { NotFound } from 'src/frontend/scenes'
import { usePost } from 'src/frontend/hooks'

export const Post = (): JSX.Element => {
    const { slug } = useParams<{ slug: string }>()
    const post = usePost(slug)

    if (post && 'Failed' === post.date) {
        return <NotFound />
    }

    if (!post || 'Loading' === post.date) {
        return <Fragment />
    }

    const thumbnail =
        post.images.list?.url ||
        post.images.thumbnail?.url ||
        post.images.background?.url ||
        DEFAULT_BG

    return (
        <Fragment>
            <Content post={post} className="columns small-12 large-6">
                <Tags items={post.tags} prefix={`single-${slug}`} />
                <SocialShare
                    title={post.title}
                    excerpt={post.excerpt}
                    thumbnail={thumbnail}
                />
                {/* <PrevNext prevNext={prevNext} />
                <RelatedPosts items={related} /> */}
            </Content>

            <aside className="columns small-12 large-3 layout__article__right">
                {/* <SingleAside /> */}
            </aside>
        </Fragment>
    )
}
