'use client'

import React, { useEffect } from 'react'

import { Post, TermTypes } from '@src/types/wordpress'
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'
import { Card } from '@common/components/containers/Card'
import { Tags } from '@src/components/content/Tags'
import { Paging } from '@common/components/containers/Paging'
import { useContext } from '@src/store'
import { setBanner, setMenu, setWrapperClass } from '@src/store/actions'
import { useArchive } from '@src/hooks/useArchive'
import { NotFound } from '@app/404'
import { MenuNames } from '@src/constants/mysql-query'

import Loading from '@app/loading'

type Props = {
    readonly type: TermTypes
    readonly slug: string
    readonly page: number
}

export function Archive({ type, slug, page }: Props) {
    const [, dispatch] = useContext()

    const { archive, loading, error } = useArchive(type, slug, page)

    useEffect(() => {
        dispatch(setMenu(MenuNames.MAIN))
    }, [dispatch])

    useEffect(() => {
        dispatch(setWrapperClass(''))

        if (archive) {
            dispatch(
                setBanner({
                    title: archive.title,
                    excerpt: archive.excerpt,
                    icon: undefined,
                    prefix: type,
                    background: archive.image,
                    backgroundColor: undefined,
                }),
            )
        }
    }, [archive, dispatch, type])

    if (loading) {
        return <Loading />
    }
    if (error || !archive) {
        return <NotFound />
    }

    return (
        <>
            <Row>
                {archive.posts.map((post: Post) => (
                    <Column
                        key={`${type}-${slug}-${page}-${post.id}`}
                        large={4}
                        medium={6}
                        small={12}
                    >
                        <Card
                            title={post.title}
                            description={post.excerpt}
                            to={post.link}
                            time={parseInt(post.date)}
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
            <Row>
                <Column small={12}>
                    {archive.posts.length > 0 && (
                        <Paging
                            totalPages={archive.pages || 1}
                            currentPage={page}
                            urlPrefix={`/${type}/${slug}`}
                        />
                    )}
                </Column>
            </Row>
        </>
    )
}
