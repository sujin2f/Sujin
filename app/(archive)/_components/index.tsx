'use client'
import React, { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
/* Components */
import ScrollToTop from '@common/components/ScrollToTop'
import { Cards } from '@app/(archive)/_components/cards'
import { Paging } from '@app/(archive)/_components/paging'
import { Row } from '@common/components/layout/Row'
import { Loading } from '@app/(archive)/_components/loading'
/* Types */
import type { PostType } from '@app/_lib/data/mysql/types'
import type { Nullable } from '@common/types'
/* CONSTANTS */
import GQL from '@app/api/graphql/constants'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import { PER_PAGE } from '@app/_lib/data/mysql/constants'
/* Utils */
import { fetchGQL } from '@common/data/graphql/fetchGQL'
import { ArchiveProp } from '@app/(archive)/types'

interface Props extends ArchiveProp {
    total: number
}

export default function ArchiveClient({ type, slug, page, total }: Props) {
    const posts = useArchive(type, slug, page)
    const pages = Math.ceil(total / PER_PAGE)

    if (posts && posts.length === 0) {
        notFound()
    }

    return (
        <>
            <ScrollToTop />
            {!posts ? (
                <Loading counts={12} large={4} medium={6} small={12} />
            ) : (
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
        </>
    )
}

const useArchive = (type: string, slug: string, page: number) => {
    const [posts, setPosts] = useState<Nullable<PostType[]>>()

    useEffect(() => {
        fetchGQL(
            GQL.queryArchivePosts,
            GQL.postOpr,
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
