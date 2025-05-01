'use server'
import { Suspense } from 'react'
import { unstable_cache } from 'next/cache'
import sanitize from 'mongo-sanitize'
import { ObjectId } from 'mongodb'
/* Components */
import { WidgetTitle } from '@app/_components/WidgetTitle'
import { Cards } from '@app/archive/_components/Cards'
import { Loading } from '@app/archive/_components/Loading'
/* Utils */
import { getCollection } from '@common/data/mongo/mongo'
import { getAggregation } from '@app/_lib/utils/server'
import { cachedRequest } from '@app/_lib/utils/cache'
import { getCachedPost } from '@app/(single)/_lib/getCachedPost'
import { getCachedRecentPosts } from '@app/(single)/_lib/getCachedRecentPosts'
/* CONSTANTS */
import { VERSION } from '@common/constants/helper'
import { revalidate } from '@app/_lib/constants'
import {
    COLLECTION,
    POST_STATUS,
    type T_Post,
    type T_ArchivePost,
    type PropWithPages,
} from '@app/_lib/types'
/* Assets */
import '@app/(single)/_components/related-posts.scss'

interface Props {
    slug: string
}

export const RelatedPosts = async ({ slug }: Props) => {
    const request = unstable_cache(
        async (slug) => await getCachedRelatedPosts(slug),
        [slug, VERSION],
        {
            tags: ['wordpress', 'post', 'related-posts'],
            revalidate,
        },
    )

    return (
        <section className="related-posts">
            <WidgetTitle>Related Posts</WidgetTitle>

            <Suspense fallback={<Loading medium={6} small={12} counts={4} />}>
                <Cards
                    posts={request(slug)}
                    keyPrefix="related"
                    medium={6}
                    small={12}
                />
            </Suspense>
        </section>
    )
}

/**
 * Fetches the related posts from MongoDB.
 * @param {string} slug
 * @returns {Promise<T_Post[]>} A promise that resolves to the related posts.
 */
const getRelatedPosts = async (slug: string): Promise<T_ArchivePost[]> => {
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
            ...getAggregation('_id'),
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
        recent.list.forEach((item) => {
            if (item.id !== post.id) {
                result[item.id] = item
            }
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
const getCachedRelatedPosts = async (
    _slug: string,
): Promise<PropWithPages<T_ArchivePost>> => {
    const slug = sanitize(_slug)
    return await cachedRequest(
        COLLECTION.POST,
        [slug, 'related'],
        async () =>
            await getRelatedPosts(slug).then(
                (list) =>
                    ({
                        list,
                        pages: 0,
                    } satisfies PropWithPages<T_ArchivePost>),
            ),
    )
}
