import React from 'react'
import { redirect } from 'next/navigation'

import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'
import { SocialShare } from '@components/(wordpress)/single/SocialShare'
import { Content } from '@components/(wordpress)/single/Content'
import { ScrollToTop } from '@components/ScrollToTop'
import {
    getSinglePageData,
    getPageParams,
} from '@app/(global-footer)/(wordpress)/util'

export default async function Page(props: PageProps) {
    const slug = await getPageParams(props)
    const [post, thumbnail] = await getSinglePageData(slug)

    if (!post) {
        redirect('/404')
    }

    return (
        <Row>
            <ScrollToTop />
            <Column medium={12} large={8} largeOffset={2}>
                <Content post={post}>
                    <SocialShare
                        title={post.title}
                        excerpt={post.excerpt}
                        thumbnail={thumbnail}
                    />
                </Content>
            </Column>
        </Row>
    )
}
