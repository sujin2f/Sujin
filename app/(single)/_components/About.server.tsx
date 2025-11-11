'use server'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import sanitize from 'mongo-sanitize'
/* Models */
import { NoContentError, DatabaseError } from '@sujin/common/model/Error'
/* Components */
import Wrapper from '@app/_components/Wrapper'
import { SocialShare } from '@app/(single)/_components/SocialShare.client'
import { Content } from '@app/(single)/_components/Content'
/* CONSTANTS */
import { VERSION } from '@sujin/common/constants/helper'
import { revalidate } from '@app/_lib/constants'
import { IMAGE_SIZE, COLLECTION, type T_Page } from '@app/_lib/types'
/* Utils */
import { getThumbnailFromPost } from '@app/_lib/utils/clients'
import { findOne } from '@sujin/common/data/mongo/mongo'
import { cachedRequest, getCacheKey } from '@app/_lib/utils/cache'
import { mongoStringify } from '@sujin/common/utils/object'
/* T_Types */
import Logger from '@sujin/common/model/Logger'

export async function AboutServer() {
    const post = await getAboutPage().catch((e) => {
        if (e instanceof DatabaseError) {
            new NoContentError(`Could not find the page -- about`)
                .setCause(e)
                .log()
            notFound()
        }
        Logger.server(e)
        throw e
    })

    const thumbnail = getThumbnailFromPost(post.images, IMAGE_SIZE.MEDIUM_LARGE)

    return (
        <Wrapper
            medium={12}
            large={8}
            largeOffset={2}
            title={post.title}
            excerpt={post.excerpt}
            icon={post.images?.icon}
            background={post.images?.background}
            backgroundColor={post.meta?.backgroundColor}
        >
            <Content post={mongoStringify(post)} type="page">
                <SocialShare
                    title={post.title}
                    excerpt={post.excerpt}
                    thumbnail={thumbnail}
                />
            </Content>
        </Wrapper>
    )
}

const getAboutPage = async () => {
    const request = unstable_cache(cached, ['about', VERSION], {
        tags: ['wordpress', 'page'],
        revalidate,
    })
    return await request('about')
}

/**
 * Get single page by slug
 * This returns the cached result if it exists
 *
 * @param {string} slug - Post slug
 * @returns {Promise<T_Page>} - The post object
 */
const cached = async (slug: string): Promise<T_Page> => {
    const request = cachedRequest(query, getCacheKey(COLLECTION.PAGE, slug))
    return await request(slug)
}

const query = async (slug: string): Promise<T_Page> =>
    await findOne<T_Page>(COLLECTION.PAGE, { slug: sanitize(slug) })
