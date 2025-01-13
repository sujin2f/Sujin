'use client'

import React, { use, useEffect } from 'react'

import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'
import { usePost } from '@src/hooks/usePost'

import { Content } from '@src/components/content'
import { SocialShare } from '@src/components/content/SocialShare'
import type { ParamPromise } from '.'
import { useContext } from '@src/store'
import { setBanner, setWrapperClass } from '@src/store/actions'
import { NotFound } from '@app/404'
import { Loading } from '@src/components/Loading'

export default function Page({ params }: ParamPromise) {
    const [, dispatch] = useContext()
    const { slug } = use(params)
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
                    <SocialShare
                        title={post.title}
                        excerpt={post.excerpt}
                        thumbnail={thumbnail}
                    />
                </Content>
            </Column>
        </Row>
    )
}
