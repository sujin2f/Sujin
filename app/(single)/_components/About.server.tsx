'use server'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import sanitize from 'mongo-sanitize'
/* Models */
import { A_Error, NoContentError, DatabaseError } from '@common/model/Error'
/* Components */
import Wrapper from '@app/_components/Wrapper'
import { SocialShare } from '@app/(single)/_components/SocialShare.client'
import { Content } from '@app/(single)/_components/Content'
/* CONSTANTS */
import { VERSION } from '@common/constants/helper'
import { revalidate } from '@app/_lib/constants'
import { IMAGE_SIZE, COLLECTION, type T_Page } from '@app/_lib/types'
/* Utils */
import { getThumbnailFromPost } from '@app/_lib/utils/clients'
import { findOne } from '@common/data/mongo/mongo'
import { cachedRequest } from '@app/_lib/utils/cache'
/* T_Types */
import type { T_Stringify } from '@common/types/mongo'

export async function AboutServer() {
    const request = unstable_cache(
        async () =>
            await getCachedPage('about').catch((e) => {
                if (e instanceof NoContentError) {
                    e.log()
                    notFound()
                }
                if (e instanceof A_Error) {
                    e.log()
                }
                throw e
            }),
        ['about', VERSION],
        {
            tags: ['wordpress', 'page'],
            revalidate,
        },
    )

    const post = await request()
    const thumbnail = getThumbnailFromPost(post.images, IMAGE_SIZE.MEDIUM_LARGE)

    return (
        <Wrapper
            className="wrapper--page--about sujin"
            medium={12}
            large={8}
            largeOffset={2}
            title={post.title}
            excerpt={post.excerpt}
            icon={post.images?.icon}
            background={post.images?.background}
            backgroundColor={post.meta?.backgroundColor}
        >
            <Content post={post} type="page">
                <SocialShare
                    title={post.title}
                    excerpt={post.excerpt}
                    thumbnail={thumbnail}
                />
            </Content>
        </Wrapper>
    )
}

/**
 * Get single page by slug
 * This returns the cached result if it exists
 *
 * @param {string} _slug - Post slug
 * @returns {Promise<T_Page>} - The post object
 */
const getCachedPage = async (_slug: string): Promise<T_Stringify<T_Page>> => {
    const slug = sanitize(_slug)
    let error: Error | null = null
    const page = await cachedRequest(
        COLLECTION.PAGE,
        [slug],
        async () =>
            await findOne<T_Page>(COLLECTION.PAGE, { slug })
                .then(
                    (post) =>
                        ({
                            ...post,
                            _id: post._id.toString(),
                        } satisfies T_Stringify<T_Page>),
                )
                .catch((e) => {
                    // Failed to find the post, cache false
                    error =
                        e instanceof DatabaseError
                            ? new NoContentError(
                                  `Could not find the page ${slug}`,
                              ).setCause(e)
                            : e
                    return false
                }),
    )
    if (error) {
        throw error
    }
    return page as T_Stringify<T_Page>
}
