import { Suspense } from 'react'
import { notFound } from 'next/navigation'
/* Components */
import Wrapper from '@lib/components/Wrapper'
import { Tags } from '@lib/components/single/Tags'
import { PrevNextPost } from '@lib/components/single/PrevNext.post'
import { RelatedPosts } from '@lib/components/single/RelatedPosts'
import { RecentPosts } from '@lib/components/single/RecentPosts'
import { SocialShare } from '@lib/components/single/SocialShare.client'
import Column from '@common/components/layout/Column'
import Row from '@common/components/layout/Row'
import { Content } from '@lib/components/single/Content'
import { GoogleAdvert } from '@common/components/GoogleAdvert'
import { LoadingArchive } from '@lib/components/archive/LoadingArchive'
/* CONSTANTS */
import { POST_STATUS, IMAGE_SIZE } from '@sujin/lib/constants'
/* Utils */
import { getThumbnailFromPost } from '@lib/utils/client'
import { getRecent } from '@lib/apollo/query/getRecent'
import { getSingle } from '@lib/apollo/query/getSingle'
import { updateHits } from '@lib/apollo/mutation/updateHits'
import { POST_TYPE } from '@sujin/lib/constants'
/* T_Types */
import type { T_Post } from '@sujin/lib/types'

type Props = {
    slug: string
}

export async function PostServer({ slug }: Props) {
    const post = await getSingle<T_Post>(slug, POST_TYPE.POST, 'POST').catch(
        () => {
            notFound()
        },
    )

    const thumbnail = getThumbnailFromPost(post.images, IMAGE_SIZE.MEDIUM_LARGE)
    const tags = post.archives.filter((tag) => tag.type === 'tag')

    // Update Tag Cloud
    if (tags.length && post.status === POST_STATUS.PUBLISH) {
        tags.forEach((tag) => updateHits(tag.slug))
    }

    return (
        <Wrapper
            title={post.title}
            excerpt={post.excerpt}
            icon={post.images?.icon}
            background={post.images?.background}
            backgroundColor={post.meta?.backgroundColor}
        >
            <Row fullWidth>
                <Column medium={12} large={7} largeOffset={2}>
                    <Content post={post} type="post">
                        <Tags items={tags} />
                        <SocialShare
                            title={post.title}
                            excerpt={post.excerpt}
                            thumbnail={thumbnail}
                        />
                        <PrevNextPost slug={slug} />
                        <RelatedPosts slug={slug} />
                    </Content>
                </Column>

                <Column
                    small={12}
                    large={3}
                    className="layout__article__right"
                    dom="aside"
                >
                    <Suspense
                        fallback={<LoadingArchive small={12} counts={4} />}
                    >
                        <RecentPosts
                            id={post.id}
                            promise={getRecent('POST_ARCHIVE')}
                        />
                    </Suspense>
                    <GoogleAdvert responsive place="sidebar" />
                </Column>
            </Row>
        </Wrapper>
    )
}
