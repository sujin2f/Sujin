/*
 * Page Component
 * scenes/public/Page
 * domain.com/slug
 */

import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'
import DEFAULT_BG from 'src/assets/images/thumbnail.svg'

import { Tags, Content, SocialShare } from 'src/frontend/components'
import { usePost } from 'src/frontend/hooks'
import { NotFound } from 'src/frontend/scenes'

export const Page = (): JSX.Element => {
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
            <div className="columns medium-12 large-2" />
            <Content post={post} className="columns large-8 medium-12">
                <Tags items={post.tags} prefix={`single-${slug}`} />

                <SocialShare
                    title={post.title}
                    excerpt={post.excerpt}
                    thumbnail={thumbnail}
                />
            </Content>
        </Fragment>
    )
}
