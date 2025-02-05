import React from 'react'
/* Components */
import ScrollToTop from '@components/ScrollToTop'
import { Cards } from '@components/wordpress/archive/cards'
import { Paging } from '@components/wordpress/archive/paging'
import { Row } from '@common/components/layout/Row'
/* Helpers */
import type { Term } from '@src/types/wordpress'

export const Archive = ({ term }: { term: Term }) => {
    const { slug, type, posts, pages, page } = term
    return (
        <>
            <ScrollToTop />
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
