import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'
import DEFAULT_BG from 'src/assets/images/thumbnail.svg'
import { Column, Row } from 'src/common'

import { Tags, Content, SocialShare } from 'src/frontend/components'
import { usePost } from 'src/frontend/hooks/usePost'
import { NotFound } from 'src/frontend/scenes/public'

export const Page = (): JSX.Element => {
    const { slug } = useParams<{ slug: string }>()
    const { post, loading, error } = usePost(slug)

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
                </Content>
            </Column>
        </Row>
    )
}
