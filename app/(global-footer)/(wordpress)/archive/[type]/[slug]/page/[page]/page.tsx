import React from 'react'
import { redirect } from 'next/navigation'

import { ScrollToTop } from '@components/ScrollToTop'
import { getArchivePageData } from '@app/(global-footer)/(wordpress)/util'
import { Cards } from '@components/(wordpress)/archive/cards'
import { Paging } from '@components/(wordpress)/archive/paging'
import { Row } from '@common/components/layout/Row'

export default async function Page(props: ArchiveProps) {
    const archive = await getArchivePageData(props)
    if (!archive) {
        redirect('/404')
    }
    const { slug, type, posts, pages, page } = archive
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
