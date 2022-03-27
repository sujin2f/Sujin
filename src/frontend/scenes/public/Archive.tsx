import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'

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
            {archive!.posts.length > 0 && (
                <Fragment>
                    {archive!.posts.map((post: PostType) => (
                        <ListItem
                            className="columns large-4 medium-6 small-12 archive__item"
                            key={`${type}-${slug}-${page}-${post.id}`}
                            item={post}
                        />
                    ))}

                    <Paging
                        totalPages={archive?.pages || 0}
                        currentPage={parseInt(page, 10) || 1}
                        urlPrefix={`/${type}/${slug}`}
                    />
                </Fragment>
            )}
        </Fragment>
    )
}
