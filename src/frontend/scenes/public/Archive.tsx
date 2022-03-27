import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'
import { Row, Column } from 'src/common'

import { ListItem, Paging } from 'src/frontend/components'
import { NotFound } from 'src/frontend/scenes/public'
import { useArchive } from 'src/frontend/hooks/useArchive'
import { Post as PostType, TermTypes } from 'src/types'

export const Archive = (): JSX.Element => {
    const { type, slug, page } = useParams<{
        type: keyof typeof TermTypes
        slug: string
        page: string
    }>()
    const { archive, loading, error } = useArchive(
        TermTypes[type],
        slug,
        parseInt(page || '1', 10),
    )

    if (error) {
        return <NotFound />
    }

    if (loading) {
        return <Fragment />
    }

    return (
        <Fragment>
            <Row>
                {archive!.posts.map((post: PostType) => (
                    <Column
                        key={`${type}-${slug}-${page}-${post.id}`}
                        large={4}
                        medium={6}
                        small={12}
                        className="archive__item"
                    >
                        <ListItem item={post} />
                    </Column>
                ))}
            </Row>
            <Row>
                <Column>
                    {archive!.posts.length > 0 && (
                        <Paging
                            totalPages={archive?.pages || 0}
                            currentPage={parseInt(page, 10) || 1}
                            urlPrefix={`/${type}/${slug}`}
                        />
                    )}
                </Column>
            </Row>
        </Fragment>
    )
}
