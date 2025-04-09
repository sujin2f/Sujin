'use client'
import React from 'react'
/* Components */
import ScrollToTop from '@common/components/ScrollToTop'
import { Cards } from '@app/(archive)/_components/cards'
import { Paging } from '@app/(archive)/_components/paging'
import { Row } from '@common/components/layout/Row'
import { Loading } from '@app/(archive)/_components/loading'
/* Types */
import type { T_PostArchive } from '@app/_lib/types'
import type { ArchiveProp } from '@app/(archive)/types'
/* CONSTANTS */
import { PER_PAGE } from '@app/_lib/data/mysql/constants'

interface Props extends ArchiveProp {
    total: number
    posts: T_PostArchive[]
}

export default function ArchiveClient({
    type,
    slug,
    posts,
    page,
    total,
}: Props) {
    const pages = Math.ceil(total / PER_PAGE)

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
