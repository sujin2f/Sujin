'use client'

import React, { Suspense, useEffect, useState } from 'react'

import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'
import { SocialShare } from '@app/components/single/SocialShare'
import { Post as PostType, Term } from '@src/types/wordpress'
import { Content } from '@app/components/single/Content'
import { Tags } from '@app/components/single/Tags'
import { PrevNext } from '@app/components/single/PrevNext'
import { RelatedPosts } from '@app/components/single/RelatedPosts'
import { RecentPosts } from '@app/components/single/RecentPosts'
import { GoogleAdvert } from '@app/components/GoogleAdvert'
import { Loading } from '@app/components/archive/loading'
import { fetchGQL } from '@common/graphql/fetchGQL'
import { archiveOpr, queryRecent } from '@src/constants/graphql'

type Props = {
    post: PostType
    thumbnail: string
}

export const Post = ({ post, thumbnail }: Props) => {
    const [recent, setRecent] = useState<Promise<Term>>()
    useEffect(() => setRecent(fetchGQL(queryRecent, archiveOpr)), [])

    return (
        <Row>
            <Column medium={12} large={6} largeOffset={3}>
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
                <Suspense
                    fallback={
                        <Loading
                            className="recent"
                            counts={4}
                            small={12}
                            fullWidth
                        />
                    }
                >
                    {recent && <RecentPosts current={post.id} term={recent} />}
                </Suspense>
                <GoogleAdvert />
            </Column>
        </Row>
    )
}
