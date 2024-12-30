import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'
import { Column } from 'src/common/components/layout/Column'
import { Row } from 'src/common/components/layout/Row'
import { Card } from 'src/common/components/containers/Card'
import { Paging } from 'src/common/components/containers/Paging'

import { Post as PostType, TermTypes } from 'src/types/wordpress'
import { NotFound } from 'src/frontend/scenes/public/NotFound'
import { useArchive } from 'src/frontend/hooks/useArchive'

const Archive = (): JSX.Element => {
    const { type, slug, page } = useParams<{
        type: keyof typeof TermTypes
        slug: string
        page: string
    }>()
    const pageInt = parseInt(page || '1')
    const { archive, loading, error, title } = useArchive(
        type,
        slug,
        pageInt,
        true,
    )

    if (error) {
        return <NotFound />
    }

    if (loading) {
        return <Fragment />
    }

    document.title = title

    return (
        <Fragment>
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
                            time={new Date(post.date)}
                            image={post.images.list || post.images.thumbnail}
                        />
                    </Column>
                ))}
            </Row>
            <Row>
                <Column>
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
