'use client'

import React, { use, useEffect } from 'react'

import type { ParamPromise } from '.'
import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'
import { usePost } from '@src/hooks/usePost'
import { Content } from '@src/components/content'
import { SocialShare } from '@src/components/content/SocialShare'
import { Tags } from '@src/components/content/Tags'
import { PrevNext } from '@src/components/content/PrevNext'
import { RelatedPosts } from '@src/components/content/RelatedPosts'
import { RecentPosts } from '@src/components/content/RecentPosts'
import { GoogleAdvert } from '@src/components/GoogleAdvert'
import { useContext } from '@src/store'
import { setBanner, setWrapperClass } from '@src/store/actions'
import Loading from '@app/loading'
import { NotFound } from '@app/404'

export default function Post({ params }: ParamPromise) {
    const [, dispatch] = useContext()
    const {
        date: [, , , slug],
    } = use(params)
    const { post, loading, error } = usePost(slug)

    useEffect(() => {
        if (post && slug) {
            dispatch(setWrapperClass(''))
            dispatch(
                setBanner({
                    title: post.title,
                    excerpt: post.excerpt,
                    icon: post.images.icon,
                    prefix: undefined,
                    background: post.images.background,
                    backgroundColor: post.meta.backgroundColor,
                }),
            )
        }
    }, [post, slug, dispatch])

    if (loading) {
        return <Loading />
    }
    if (error || !post) {
        return <NotFound />
    }

    const thumbnail =
        post.images.list?.url || post.images.thumbnail?.url || '/thumbnail.png'

    return (
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
                <GoogleAdvert />
            </Column>
        </Row>
    )
}
