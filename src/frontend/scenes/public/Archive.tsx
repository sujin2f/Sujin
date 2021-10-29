/*
 * Archive Component
 *
 * //domain.com/category/blog
 * //domain.com/tag/blog
 * //domain.com/search/blog
 */

import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'

// import { Paging } from 'src/frontend/components/common/Paging'
import { SimplePost } from 'src/frontend/components/common/SimplePost'
import { NotFound } from 'src/frontend/scenes/public/NotFound'
import { useArchive } from 'src/frontend/hooks/archive'
import { Post as PostType, TermTypes } from 'src/types'

export const Archive = (): JSX.Element => {
    const { type, slug, page } = useParams<{
        type: keyof typeof TermTypes
        slug: string
        page: string
    }>()
    const posts = useArchive(TermTypes[type], slug, parseInt(page || '1'))

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
                        <SimplePost
                            className="columns large-4 medium-6 small-12 archive__item"
                            key={`${type}-${slug}-${page}-${post.id}`}
                            item={post}
                        />
                    ))}

                    {/* <Paging
                        totalPages={
                            archive.item.totalPages
                                ? archive.item.totalPages
                                : 0
                        }
                        currentPage={parseInt(page, 10) || 1}
                        urlPrefix={`/${type}/${slug}`}
                    /> */}
                </Fragment>
            )}
        </Fragment>
    )
}
