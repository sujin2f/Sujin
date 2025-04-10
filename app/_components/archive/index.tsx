'use client'
import React from 'react'
/* Components */
import { Cards } from '@app/_components/archive/cards'
import { Paging } from '@app/_components/archive/paging'
import { Row } from '@common/components/layout/Row'
/* Types */
import type { T_PostArchive, ArchiveProp } from '@app/_lib/types'
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
            <Row fullWidth>
                <Cards
                    posts={posts}
                    keyPrefix={`${type}-${slug}-${page}`}
                    large={4}
                    medium={6}
                    small={12}
                />
            </Row>
            <Paging pages={pages} page={page} urlPrefix={`/${type}/${slug}`} />
        </>
    )
}
