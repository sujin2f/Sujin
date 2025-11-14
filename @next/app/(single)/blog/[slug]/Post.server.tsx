import { notFound } from 'next/navigation'
/* Components */
import Wrapper from '@lib/components/Wrapper'
import { Tags } from '@lib/components/single/Tags'
import { PrevNext } from '@lib/components/single/PrevNext.server'
import { RelatedPosts } from '@lib/components/single/RelatedPosts.server'
import { RecentPosts } from '@lib/components/single/RecentPosts'
import { SocialShare } from '@lib/components/single/SocialShare.client'
import Column from '@common/components/layout/Column'
import Row from '@common/components/layout/Row'
import { Content } from '@lib/components/single/Content'
import { GoogleAdvert } from '@common/components/GoogleAdvert'
/* CONSTANTS */
import {
    IMAGE_SIZE,
    POST_IMAGE_LOCATION,
    POST_STATUS,
    T_Post,
} from '@sujin/lib/types'
import { ARCHIVE_POSTS, IMAGE, POST } from '@lib/constants/graphql-fields'
/* Utils */
import { getThumbnailFromPost } from '@lib/utils/client'
import { getRecent, updateHits } from '@lib/apollo/archives'
import { getSingle } from '@lib/apollo/single'
import { Suspense } from 'react'
import { LoadingArchive } from '@lib/components/archive/LoadingArchive'

type Props = {
    slug: string
}

const fields = `
    ${POST}
    images {
        ${POST_IMAGE_LOCATION.ICON} {
            url
        }
        ${POST_IMAGE_LOCATION.BACKGROUND} {
            ${IMAGE}
            sizes {
                ${IMAGE_SIZE.MEDIUM} { ${IMAGE} }
                ${IMAGE_SIZE.MEDIUM_LARGE} { ${IMAGE} }
                ${IMAGE_SIZE.LARGE} { ${IMAGE} }
            }
        }
        ${POST_IMAGE_LOCATION.LIST} {
            sizes {
                ${IMAGE_SIZE.MEDIUM_LARGE} { ${IMAGE} }
            }
        }
        ${POST_IMAGE_LOCATION.THUMBNAIL} {
            sizes {
                ${IMAGE_SIZE.MEDIUM_LARGE} { ${IMAGE} }
            }
        }
    }`

export async function PostServer({ slug }: Props) {
    const post = await getSingle<T_Post>(slug, 'post', fields).catch(() => {
        notFound()
    })

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
                        <PrevNext slug={slug} />
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
                            promise={getRecent(ARCHIVE_POSTS)}
                        />
                    </Suspense>
                    <GoogleAdvert responsive place="sidebar" />
                </Column>
            </Row>
        </Wrapper>
    )
}
