import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'

import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'
import { Card } from '@common/components/containers/Card'
import { Paging } from '@common/components/containers/Paging'

import { Banner } from '@frontend/scenes/layout/Banner'
import { Post as PostType, TermTypes } from '@project/types/wordpress'
import { NotFound } from '@frontend/scenes/public/NotFound'
import { Tags } from '@frontend/components/Tags'
import { useArchive } from '@frontend/hooks/useArchive'

import DefaultThumbnail from '@frontend/images/thumbnail-default.png'

function Archive() {
    const { type, slug, page } = useParams<{
        type: TermTypes
        slug: string
        page: string
    }>()

    const pageInt = parseInt(page || '1')
    const { archive, loading, error } = useArchive({
        type: type || TermTypes.category,
        slug: slug || '',
        page: pageInt,
    })

    if (error) {
        return <NotFound />
    }

    if (loading) {
        return <Fragment />
    }

    if (!archive) {
        // 404
        return <Fragment />
    }

    return (
        <Fragment>
            <Banner
                title={archive.title}
                excerpt={archive.excerpt}
                background={archive.image}
            />
            <Row>
                {archive!.posts.map((post: PostType) => (
                    <Column
                        key={`${type}-${slug}-${pageInt}-${post.id}`}
                        large={4}
                        medium={6}
                        small={12}
                    >
                        <Card
                            title={post.title}
                            description={post.excerpt}
                            to={post.link}
                            time={new Date(parseInt(post.date)).getTime()}
                            image={
                                post.images.list?.url ||
                                post.images.thumbnail?.url ||
                                DefaultThumbnail
                            }
                        >
                            <Tags items={post.tags} />
                        </Card>
                    </Column>
                ))}
            </Row>
            <Row>
                <Column small={12}>
                    {archive!.posts.length > 0 && (
                        <Paging
                            totalPages={archive?.pages || 1}
                            currentPage={pageInt}
                            urlPrefix={`/${type}/${slug}`}
                        />
                    )}
                </Column>
            </Row>
        </Fragment>
    )
}

export default Archive
