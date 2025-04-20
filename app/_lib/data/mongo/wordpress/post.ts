import { ObjectId, WithId } from 'mongodb'
/* Models */
import Cached from '@common/model/Cached'
import { ERROR_MESSAGE, ServerError } from '@app/_lib/constants-error'
/* Utils */
import { getPostBy, getPostsBy } from '@app/_lib/data/mysql/post'
import { convertImageBlockURL } from '@app/_lib/data/mysql/utils'
import { getCacheKey } from '@app/_lib/utils'
import { MutationResultType } from '@app/api/graphql/constants'
import { schemaFormatter } from '@common/utils/object'
import { auth, isAdmin } from '@app/_lib/data/mongo/user'
import { getCollection, insertOrReplace } from '@common/data/mongo/mongo'
import { getAggregation } from '@app/_lib/utils-server'
import {
    updateTotal,
    formatter as archiveFormatter,
} from '@app/_lib/data/mongo/wordpress/archive'
/* CONSTANTS */
import { default as schema } from '@app/_lib/data/mongo/schema/10.3.4'
import { IS_DEV } from '@common/constants/helper'
import { PER_PAGE } from '@app/_lib/data/mysql/constants'
import { DAY_IN_SECONDS } from '@common/constants/datetime'
import {
    ARCHIVE,
    COLLECTION,
    POST_STATUS,
    POST_TYPE,
    type POST_IMAGE_LOCATION,
    type T_Post,
    type T_MySQLPost,
    type T_PrevNext,
    type T_ArchivePost,
    type T_Archive,
    type ArchivePostsProp,
} from '@app/_lib/types'
/* T_Types */
import type { T_Mongo } from '@common/types/mongo'

const format = (post: Record<string, unknown>): T_Post =>
    schemaFormatter(post, schema.post) as T_Post

/**
 * Get single post by slug
 * This returns the cached result if it exists
 *
 * @param {string} slug - Post slug
 */
export const getCachedPost = async (slug: string): Promise<T_Post> =>
    await Cached.getInstance().getOrExecute(
        getCacheKey(COLLECTION.POST, slug),
        async () => {
            const collection = await getCollection<T_Post>(COLLECTION.POST)
            const posts = await collection
                .aggregate<T_Post>([
                    {
                        $match: {
                            slug,
                        },
                    },
                    ...getAggregation('_id'),
                    ...getAggregation('expand-archive'),
                ])
                .toArray()
            if (!posts.length)
                throw new ServerError(ERROR_MESSAGE.PAGE.GET_ONE, slug)
            return posts[0]
        },
        DAY_IN_SECONDS,
        IS_DEV,
    )

const updateMongoFromMySQL = async (post: T_MySQLPost) => {
    const slug = post.slug
    const archives: ObjectId[] = []
    Cached.getInstance().flush(getCacheKey(COLLECTION.POST, slug))

    // Image
    Object.keys(post.images).forEach((key) => {
        const imageKey = key as POST_IMAGE_LOCATION
        post.images[imageKey] = convertImageBlockURL(post.images[imageKey]!)
    })

    for (const term of post.terms.filter(
        (term) => term.type === ARCHIVE.CATEGORY || term.type === ARCHIVE.TAG,
    )) {
        const collection = await getCollection<T_Archive>(COLLECTION.ARCHIVE)
        const archive = await collection.findOne({
            slug: term.slug,
            type: term.type,
        })
        if (archive) {
            archives.push(archive._id)
        } else {
            const result = await collection.insertOne(
                archiveFormatter({ ...term, hits: 0, total: 0 }),
            )
            archives.push(result.insertedId)
        }
    }

    await insertOrReplace<T_Post>(
        COLLECTION.POST,
        {
            slug,
        },
        format({ ...post, archives }),
    )

    return archives
}

const updatePost = async (slug: string, nonce?: string) => {
    await auth(nonce, slug)
    Cached.getInstance().flush(getCacheKey(COLLECTION.POST, slug))
    await getPostBy('slug', slug, POST_TYPE.POST, true).then(async (post) => {
        const archives = await updateMongoFromMySQL(post)
        await updateTotal(archives)
    })
}

export const updateArchivePosts = async (
    type: ARCHIVE,
    slug: string,
    page: number,
) => {
    await auth()
    Cached.getInstance().flush(getCacheKey(COLLECTION.POST))
    Cached.getInstance().flush(getCacheKey(COLLECTION.ARCHIVE, type, slug))

    await getPostsBy(type, POST_TYPE.POST, slug, page, true).then(
        async (result) => {
            const archives: ObjectId[] = []
            for (const item of result) {
                archives.push(...(await updateMongoFromMySQL(item)))
            }
            await updateTotal(archives)
        },
    )
}

export const getCachedPosts = async (
    archive: WithId<T_Archive>,
    page: number,
): Promise<ArchivePostsProp> =>
    await Cached.getInstance().getOrExecute<ArchivePostsProp>(
        getCacheKey(COLLECTION.ARCHIVE, archive.type, archive.slug, page),
        async () => {
            const collection = await getCollection<T_Post>(COLLECTION.POST)
            const result = await collection
                .aggregate<T_ArchivePost>([
                    {
                        $match: {
                            archives: new ObjectId(archive._id),
                            status: POST_STATUS.PUBLISH,
                        },
                    },
                    {
                        $sort: { date: -1 },
                    },
                    ...getAggregation('paging', page),
                    ...getAggregation('_id'),
                    ...getAggregation('expand-archive'),
                    ...getAggregation('to-archive-post'),
                ])
                .toArray()
            return {
                posts: result,
                pages: Math.ceil(archive.total / PER_PAGE),
            } satisfies ArchivePostsProp
        },
        DAY_IN_SECONDS,
        IS_DEV,
    )

export const getArchivePosts = async (_id: ObjectId, page: number) => {
    if (!(await isAdmin()))
        throw new ServerError(
            ERROR_MESSAGE.GENERAL.UNAUTHORIZED,
            'getArchivePosts()',
        )

    const collection = await getCollection<T_Mongo<T_Post>>(COLLECTION.POST)
    return await collection
        .aggregate<T_ArchivePost>([
            {
                $match: {
                    archives: new ObjectId(_id),
                },
            },
            {
                $sort: { date: -1 },
            },
            ...getAggregation('paging', page),
            ...getAggregation('_id'),
            ...getAggregation('to-archive-post'),
            {
                $project: {
                    archives: 0,
                },
            },
        ])
        .toArray()
}

export const getCachedSearchPosts = async (
    keyword: string,
    page: number,
): Promise<ArchivePostsProp> =>
    await Cached.getInstance().getOrExecute(
        getCacheKey(COLLECTION.ARCHIVE, 'search', keyword, page),
        async () => {
            const doc = {
                $text: { $search: keyword },
                status: POST_STATUS.PUBLISH,
            }

            const collection = await getCollection<T_Mongo<T_Post>>(
                COLLECTION.POST,
            )
            const total = await collection.countDocuments(doc)
            const posts = await collection
                .aggregate<T_ArchivePost>([
                    {
                        $match: doc,
                    },
                    {
                        $sort: { date: -1 },
                    },
                    ...getAggregation('paging', page),
                    ...getAggregation('_id'),
                    ...getAggregation('expand-archive'),
                    ...getAggregation('to-archive-post'),
                ])
                .toArray()

            return {
                posts,
                pages: Math.ceil(total / PER_PAGE),
            } satisfies ArchivePostsProp
        },
        DAY_IN_SECONDS,
        IS_DEV,
    )

const getPrevNext = async (slug: string): Promise<T_PrevNext[]> => {
    const post = await getCachedPost(slug)
    const _ids = post.archives
        .filter((archive) => archive.type === ARCHIVE.CATEGORY)
        .map((category) => new ObjectId(category._id))

    const collection = await getCollection<T_Mongo<T_Post>>(COLLECTION.POST)
    const prev = await collection
        .find({
            id: { $ne: post.id },
            status: POST_STATUS.PUBLISH,
            date: { $lt: post.date },
            archives: { $in: _ids },
        })
        .sort({ date: -1 })
        .limit(1)
        .project<T_PrevNext>({
            _id: 0,
            title: 1,
            link: 1,
        })
        .toArray()
    const next = await collection
        .find({
            id: { $ne: post.id },
            status: POST_STATUS.PUBLISH,
            date: { $gt: post.date },
            archives: { $in: _ids },
        })
        .sort({ date: 1 })
        .limit(1)
        .project<T_PrevNext>({
            _id: 0,
            title: 1,
            link: 1,
        })
        .toArray()
    return [prev[0], next[0]]
}

/**
 * Fetches the recent posts from the cache or MongoDB.
 * This returns the cached result if it exists
 *
 * @param {string} slug - The id of the post
 * @returns {Promise<T_PrevNext[]>} A promise that resolves to the recent posts.
 */
export const getCachedPrevNext = async (slug: string): Promise<T_PrevNext[]> =>
    await Cached.getInstance().getOrExecute(
        getCacheKey(COLLECTION.POST, slug, 'prev-next'),
        async () => await getPrevNext(slug),
        DAY_IN_SECONDS,
        IS_DEV,
    )

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
export const getCachedRecentPosts = async (): Promise<ArchivePostsProp> =>
    await Cached.getInstance().getOrExecute<ArchivePostsProp>(
        getCacheKey(COLLECTION.POST, 'recent'),
        async () =>
            await getRecentPosts().then(
                (posts) =>
                    ({
                        posts,
                        pages: 0,
                    } satisfies ArchivePostsProp),
            ),
        DAY_IN_SECONDS,
        IS_DEV,
    )

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
        recent.posts.forEach((item) => {
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
export const getCachedRelatedPosts = async (
    slug: string,
): Promise<ArchivePostsProp> =>
    await Cached.getInstance().getOrExecute<ArchivePostsProp>(
        getCacheKey(COLLECTION.POST, slug, 'related'),
        async () =>
            await getRelatedPosts(slug).then(
                (posts) =>
                    ({
                        posts,
                        pages: 0,
                    } satisfies ArchivePostsProp),
            ),
        DAY_IN_SECONDS,
        IS_DEV,
    )

export const mutatePost = async (
    nonce: string,
    slug: string,
): Promise<MutationResultType> => {
    await updatePost(slug, nonce)
    return {
        result: true,
    }
}
