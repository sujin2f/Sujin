import sanitize from 'mongo-sanitize'
import mongoose from 'mongoose'
/* Models */
import Logger from '@src/utils/logger'
import { Post } from '@src/schema/post'
/* Utils */
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'
import { post as getPost } from '@src/resolvers/post'
import { getRecentPosts } from './getRecentPosts'
/* CONSTANTS */
import {
    POST_STATUS,
    COLLECTION,
    GQL_QUERY_TYPE,
    POST_TYPE,
} from '@sujin/lib/constants'
import {
    AGGREGATE_ARCHIVE_POST,
    AGGREGATE_EXPAND_ARCHIVES,
} from '@src/constants'
/* T_Types */
import type { T_ArchivePost, T_Post } from '@sujin/lib/types'

/**
 * Fetches the related posts from MongoDB.
 * @param {string} slug
 * @returns {Promise<T_Post[]>} A promise that resolves to the related posts.
 */
const query = async (slug: string): Promise<T_ArchivePost[]> => {
    const post = (
        await getPost(
            { slug, postType: POST_TYPE.POST, query: GQL_QUERY_TYPE.QUERY },
            { token: '' },
        )
    )[0] as T_Post
    const result: Record<number, T_ArchivePost> = {}

    const archive_ids = post.archives.map(
        (archive) => new mongoose.Types.ObjectId(archive._id),
    )

    await Post.aggregate<T_ArchivePost>([
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
        ...AGGREGATE_EXPAND_ARCHIVES,
        ...AGGREGATE_ARCHIVE_POST,
    ]).then((posts) => {
        posts.forEach((item) => {
            result[item.id] = item
        })
    })

    if (Object.keys(result).length === 4) {
        return Object.values(result)
    }

    await getRecentPosts().then((recent) =>
        recent
            .filter((item) => item.slug !== slug)
            .forEach((item) => {
                result[item.id] = item
            }),
    )
    return Object.values(result).slice(0, 4)
}

type Param = {
    slug: string
}

/**
 * Fetches the recent posts from the cache or MongoDB.
 * This returns the cached result if it exists
 *
 * @param {string} slug - The id of the post
 * @returns {Promise<T_ArchivePost[]>} A promise that resolves to the recent posts.
 */
export const getRelatedPosts = async (
    _: unknown,
    { slug: _slug }: Param,
): Promise<T_ArchivePost[]> => {
    const slug = sanitize(_slug)
    const request = cachedRequest(
        query,
        getCacheKey(COLLECTION.POST, slug, 'related'),
    )
    const result = await request(slug)
    Logger.info('🤟 related query has been finished')
    return result
}
