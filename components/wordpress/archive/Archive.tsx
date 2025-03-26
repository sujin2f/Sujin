'use client'
import React, { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
/* Components */
import ScrollToTop from '@components/ScrollToTop'
import { Cards } from '@components/wordpress/archive/cards'
import { Paging } from '@components/wordpress/archive/paging'
import { Row } from '@common/components/layout/Row'
import { Loading } from '@components/wordpress/archive/loading'
/* Types */
import type { Post } from '@src/types/wordpress'
import type { Nullable } from '@common/types'
/* Constants */
import { postOpr, queryArchive } from '@src/constants/graphql'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import { PER_PAGE } from '@src/constants/mysql-query'
/* Utils */
import { fetchGQL } from '@common/data/graphql/fetchGQL'

interface Props {
    type: string
    slug: string
    page: number
    total: number
}

export const Archive = ({ type, slug, page, total }: Props) => {
    const posts = useArchive(type, slug, page)
    const pages = Math.ceil(total / PER_PAGE)

    if (posts && posts.length === 0) {
        notFound()
    }

    return (
        <>
            <ScrollToTop />
            {/* Loading */}
            {!posts && <Loading counts={12} large={4} medium={6} small={12} />}
            <Row>
                {/* Result */}
                {posts && (
                    <>
                        <Row>
                            <Cards
                                posts={posts}
                                keyPrefix={`${type}-${slug}-${page}`}
                                large={4}
                                medium={6}
                                small={12}
                            />
                        </Row>
                        <Paging
                            pages={pages}
                            page={page}
                            urlPrefix={`/${type}/${slug}`}
                        />
                    </>
                )}
            </Row>
        </>
    )
}

const useArchive = (type: string, slug: string, page: number) => {
    const [posts, setPosts] = useState<Nullable<Post[]>>()
    useEffect(() => {
        fetchGQL(
            queryArchive,
            postOpr,
            WEEK_IN_SECONDS,
            type,
            slug,
            parseInt(page.toString(), 10),
        )
            .then((result) => setPosts(result))
            .catch(() => setPosts([]))
    }, [page, slug, type])

    return posts
}
