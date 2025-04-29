/* Utils */
import { getCollection } from '@common/data/mongo/mongo'
import { getAggregation } from '@app/_lib/utils/server'
import { cachedRequest } from '@app/_lib/utils/cache'
/* CONSTANTS */
import {
    COLLECTION,
    POST_STATUS,
    type T_Post,
    type T_ArchivePost,
    type PropWithPages,
} from '@app/_lib/types'

/**
 * Fetches the recent posts from MongoDB.
 *
 * @returns {Promise<T_Post[]>} A promise that resolves to the recent posts.
 */
const getRecentPosts = async (): Promise<T_ArchivePost[]> => {
    const collection = await getCollection<T_Post>(COLLECTION.POST)
    return await collection
        .aggregate<T_ArchivePost>([
            {
                $match: { status: POST_STATUS.PUBLISH },
            },
            {
                $sort: { date: -1 },
            },
            ...getAggregation('paging', 1),
            ...getAggregation('_id'),
            ...getAggregation('expand-archive'),
            ...getAggregation('to-archive-post'),
        ])
        .toArray()
}

/**
 * Fetches the recent posts from the cache or MongoDB.
 * It uses a caching mechanism to avoid fetching the posts multiple times within a week.
 *
 * @returns {Promise<T_Post[]>} A promise that resolves to the recent posts.
 */
export const getCachedRecentPosts = async (): Promise<
    PropWithPages<T_ArchivePost>
> =>
    await cachedRequest(
        COLLECTION.POST,
        ['recent'],
        async () =>
            await getRecentPosts().then(
                (list) =>
                    ({
                        list,
                        pages: 1,
                    } satisfies PropWithPages<T_ArchivePost>),
            ),
    )
