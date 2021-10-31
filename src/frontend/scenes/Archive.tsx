/*
 * Archive Component
 *
 * //domain.com/category/blog
 * //domain.com/tag/blog
 * //domain.com/search/blog
 */

import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'

import { ListItem, Paging } from 'src/frontend/components'
import { NotFound } from 'src/frontend/scenes'
import { useArchive } from 'src/frontend/hooks'
import { Post as PostType, TermTypes } from 'src/types'

export const Archive = (): JSX.Element => {
    const { type, slug, page } = useParams<{
        type: keyof typeof TermTypes
        slug: string
        page: string
    }>()
    const [posts, term] = useArchive(
        TermTypes[type],
        slug,
        parseInt(page || '1'),
    )

    if ('Failed' === posts) {
        return <NotFound />
    }

    if (!posts || 'Loading' === posts) {
        return <Fragment />
    }

    return (
        <Fragment>
            {posts.length > 0 && (
                <Fragment>
                    {posts.map((post: PostType) => (
                        <ListItem
                            className="columns large-4 medium-6 small-12 archive__item"
                            key={`${type}-${slug}-${page}-${post.id}`}
                            item={post}
                        />
                    ))}

                    <Paging
                        totalPages={term?.pages || 0}
                        currentPage={parseInt(page) || 1}
                        urlPrefix={`/${type}/${slug}`}
                    />
                </Fragment>
            )}
        </Fragment>
    )
}
