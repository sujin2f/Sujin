import React from 'react'
import { redirect } from 'next/navigation'

import {
    getPostParams,
    getSinglePageData,
} from '@app/(global-footer)/(wordpress)/util'
import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'
import { SocialShare } from '@components/(wordpress)/single/SocialShare'
import { Content } from '@components/(wordpress)/single/Content'
import { ScrollToTop } from '@components/ScrollToTop'
import { Tags } from '@components/(wordpress)/single/Tags'
import { PrevNext } from '@components/(wordpress)/single/PrevNext'
import { RelatedPosts } from '@components/(wordpress)/single/RelatedPosts'
import { RecentPosts } from '@components/(wordpress)/single/RecentPosts'
import { GoogleAdvert } from '@components/GoogleAdvert'

export default async function Page(props: PostProps) {
    const params = await getPostParams(props.params)
    if (!params) {
        redirect('/404')
    }
    const [, , , slug] = params

    const [post, thumbnail] = await getSinglePageData(slug, true)

    if (!post) {
        redirect('/404')
    }

    return (
        <Row>
            <ScrollToTop />
            <Column medium={12} large={7} largeOffset={2}>
                <Content post={post}>
                    <Tags items={post.tags} />
                    <SocialShare
                        title={post.title}
                        excerpt={post.excerpt}
                        thumbnail={thumbnail}
                    />
                    <PrevNext prevNext={post.prevNext} />
                    <RelatedPosts items={post.related} />
                </Content>
            </Column>

            <Column
                small={12}
                large={3}
                className="layout__article__right"
                dom="aside"
            >
                <RecentPosts current={post.id} />
                <GoogleAdvert />
            </Column>
        </Row>
    )
}
