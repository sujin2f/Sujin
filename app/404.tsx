'use client'

import React, { useEffect } from 'react'

import { Post } from '@src/types/wordpress'
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'
import { Card } from '@common/components/containers/Card'
import { Tags } from '@src/components/content/Tags'
import { useContext } from '@src/store'
import { setBanner, setWrapperClass } from '@src/store/actions'
import { useRecentPost } from '@src/hooks/useRecentPost'

export function NotFound() {
    const [, dispatch] = useContext()
    const { recentPost } = useRecentPost()

    useEffect(() => {
        dispatch(setWrapperClass(''))
        dispatch(
            setBanner({
                title: '404 Not Found',
                excerpt:
                    'We cannot find the result. See below for recent articles.',
                icon: undefined,
                prefix: undefined,
                background: undefined,
                backgroundColor: undefined,
            }),
        )
    }, [dispatch])

    return (
        <Row>
            {recentPost.map((post: Post) => (
                <Column key={post.id} large={4} medium={6} small={12}>
                    <Card
                        title={post.title}
                        description={post.excerpt}
                        to={post.link}
                        image={
                            post.images.list?.url ||
                            post.images.thumbnail?.url ||
                            '/thumbnail.png'
                        }
                    >
                        <Tags items={post.tags} />
                    </Card>
                </Column>
            ))}
        </Row>
    )
}
