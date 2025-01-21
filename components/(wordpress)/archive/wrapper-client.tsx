'use client'

import React, { use } from 'react'

import { Term } from '@src/types/wordpress'
import { Cards } from '@components/(wordpress)/archive/cards'
import { Paging } from '@components/(wordpress)/archive/paging'
import { Row } from '@common/components/layout/Row'

type Props = {
    readonly term: Promise<Term>
}

export const WrapperClient = (props: Props) => {
    const term = use(props.term)
    const { posts, pages, type, slug, page } = term as Term

    return (
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

            <Paging pages={pages} page={page} urlPrefix={`/${type}/${slug}`} />
        </>
    )
}
