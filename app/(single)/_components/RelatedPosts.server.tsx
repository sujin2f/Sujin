'use server'
import { Suspense } from 'react'
import { unstable_cache } from 'next/cache'
import { ObjectId } from 'mongodb'
/* Components */
import { WidgetTitle } from '@app/_components/WidgetTitle'
import { Cards } from '@app/archive/_components/Cards.use'
import { Loading } from '@app/archive/_components/Loading'
/* Utils */
import { getCollection } from '@common/data/mongo/mongo'
import { getAggregation } from '@app/_lib/utils/server'
import { cachedRequest, getCacheKey } from '@app/_lib/utils/cache'
import { getCachedPost } from '@app/(single)/_lib/getCachedPost'
import { getCachedRecentPosts } from '@app/api/graphql/_lib/getCachedRecentPosts'
/* CONSTANTS */
import { VERSION } from '@common/constants/helper'
import { revalidate } from '@app/_lib/constants'
import {
    COLLECTION,
    POST_STATUS,
    type T_Post,
    type T_ArchivePost,
} from '@app/_lib/types'
/* Assets */
import '@app/(single)/_components/RelatedPosts.scss'

interface Props {
    slug: string
}

export const RelatedPosts = async ({ slug }: Props) => {
    return (
        <section className="related-posts">
            <WidgetTitle>Related Posts</WidgetTitle>

            <Suspense fallback={<Loading medium={6} small={12} counts={4} />}>
                <Cards
                    posts={getRelatedPosts(slug).then((list) => ({
                        list,
                        pages: 0,
                    }))}
                    keyPrefix="related"
                    medium={6}
                    small={12}
                />
            </Suspense>
        </section>
    )
}

const getRelatedPosts = async (slug: string): Promise<T_ArchivePost[]> => {
    const request = unstable_cache(cached, [slug, VERSION], {
        tags: ['wordpress', 'post', 'related-posts'],
        revalidate,
    })
    return await request(slug)
}

/**
 * Fetches the related posts from MongoDB.
 * @param {string} slug
 * @returns {Promise<T_Post[]>} A promise that resolves to the related posts.
 */
const query = async (slug: string): Promise<T_ArchivePost[]> => {
    const post = await getCachedPost(slug)
    const result: Record<number, T_ArchivePost> = {}

    const archive_ids = post.archives.map(
        (archive) => new ObjectId(archive._id),
    )

    const collection = await getCollection<T_Post>(COLLECTION.POST)
    await collection
        .aggregate<T_ArchivePost>([
            {
                $match: {
                    id: { $not: { $eq: post.id } },
                    status: POST_STATUS.PUBLISH,
                    archives: { $in: archive_ids },
                },
            },
            {
                $sort: { date: -1 },
            },
            {
                $limit: 4,
            },
            ...getAggregation('expand-archive'),
            ...getAggregation('to-archive-post'),
        ])
        .toArray()
        .then((posts) => {
            posts.forEach((item) => {
                result[item.id] = item
            })
        })

    if (Object.keys(result).length === 4) {
        return Object.values(result)
    }

    await getCachedRecentPosts().then((recent) =>
        recent
            .filter((item) => item.slug !== slug)
            .forEach((item) => {
                result[item.id] = item
            }),
    )
    return Object.values(result).slice(0, 4)
}

/**
 * Fetches the related posts from the cache or MongoDB.
 * It uses a caching mechanism to avoid fetching the posts multiple times within a week.
 *
 * @param {string} slug
 * @returns {Promise<T_Post[]>} A promise that resolves to the related posts.
 */
const cached = async (slug: string): Promise<T_ArchivePost[]> => {
    const request = cachedRequest(
        query,
        getCacheKey(COLLECTION.POST, slug, 'related'),
    )
    return await request(slug)
}
