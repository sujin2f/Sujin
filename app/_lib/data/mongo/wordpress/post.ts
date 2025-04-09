import type { Filter } from 'mongodb'
/* Models */
import Mongo from '@common/data/mongo/mongo'
import Cached from '@common/model/Cached'
/* Utils */
import { getPostBy, getPostsBy } from '@app/_lib/data/mysql/post'
import { updateTag } from '@app/_lib/data/mongo/wordpress/tag'
import { convertImageBlockURL } from '@app/_lib/data/mysql/utils'
import { getCacheKey } from '@app/_lib/utils'
import { updateCategory } from '@app/_lib/data/mongo/wordpress/category'
import { MutationResultType } from '@app/api/graphql/constants'
import { formatPostImage } from '@app/_lib/data/mongo/wordpress/util'
import { auth, isAdmin } from '@app/_lib/utils-server'
/* CONSTANTS */
// import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import { IS_DEV } from '@common/constants/helper'
import { PER_PAGE } from '@app/_lib/data/mysql/constants'
import {
    ARCHIVE,
    COLLECTION,
    POST_STATUS,
    POST_TYPE,
    type POST_IMAGE_LOCATION,
    type T_Post,
    type T_MySQLPost,
    type T_PrevNext,
    type T_PostArchive,
} from '@app/_lib/types'

const formatPrevNext = (post: Record<string, unknown>): T_PrevNext =>
    ({
        title: post.title,
        link: post.link,
    } as T_PrevNext)

const formatArchivePost = (post: Record<string, unknown>): T_PostArchive => {
    const formatted = {
        ...formatPrevNext(post),
        id: post.id,
        slug: post.slug,
        excerpt: post.excerpt || '',
        date: post.date,
        status: post.status,
    } as T_PostArchive

    if (post.images) {
        formatted.images = formatPostImage(post.images)
    }

    if (post.terms && Array.isArray(post.terms)) {
        formatted.terms = post.terms.filter(
            (term) => term.type === 'category' || term.type === 'tag',
        )
    }

    return formatted
}

const format = (post: Record<string, unknown>): T_Post =>
    ({
        ...formatArchivePost(post),
        content: post.content,
        meta: post.meta,
    } as T_Post)

/**
 * Get single post by slug
 * This returns the cached result if it exists
 *
 * @param {string} slug - Post slug
 * @param {boolean} ignoreStatus - The flag to ignore status
 * @returns {Promise<WithId<WPPost>>} - The post object
 */
export const getCachedPost = async (slug: string): Promise<T_Post> => {
    const doc: Filter<T_Post> = { slug }
    return await Cached.getInstance().getOrExecute(
        getCacheKey(COLLECTION.POST, slug),
        async () =>
            await Mongo.findOne<T_Post>(COLLECTION.POST, doc).then((post) =>
                format(post),
            ),
        0,
        IS_DEV,
    )
}

const updateMongoFromMySQL = async (
    post: T_MySQLPost,
): Promise<[T_Post, string[], string[]]> => {
    const slug = post.slug

    Cached.getInstance().flush(getCacheKey(COLLECTION.POST, slug))
    Object.keys(post.images).forEach((key) => {
        const imageKey = key as POST_IMAGE_LOCATION
        post.images[imageKey] = convertImageBlockURL(post.images[imageKey]!)
    })
    const newPost = format(post)

    const categories: string[] = newPost.terms
        .filter((term) => term.type === ARCHIVE.CATEGORY)
        .map((term) => term.slug)
    const tags: string[] = newPost.terms
        .filter((term) => term.type === ARCHIVE.TAG)
        .map((term) => term.slug)

    await Mongo.findOne<T_Post>(COLLECTION.POST, {
        slug,
    })
        // Post exist: update archive and replace the post
        .then(async (result) => {
            result.terms
                .filter((term) => term.type === ARCHIVE.CATEGORY)
                .forEach((term) => {
                    categories.push(term.slug)
                })
            result.terms
                .filter((term) => term.type === ARCHIVE.TAG)
                .forEach((term) => {
                    tags.push(term.slug)
                })
            await Mongo.insertOrReplace<T_Post>(
                COLLECTION.POST,
                {
                    slug,
                },
                format(post),
            )
        })
        // New post
        .catch(
            async () =>
                await Mongo.insertOne<T_Post>(COLLECTION.POST, format(post)),
        )

    return [newPost, categories, tags]
}

const updateArchives = async (categories: string[], tags: string[]) => {
    for (const cat of Array.from(new Set(categories))) {
        await updateCategory(cat)
    }
    for (const tag of Array.from(new Set(tags))) {
        await updateTag(tag)
    }
}

const updatePost = async (slug: string, nonce?: string) => {
    await auth(POST_TYPE.POST, nonce, slug)
    Cached.getInstance().flush(getCacheKey(COLLECTION.POST, slug))
    await getPostBy('slug', slug, POST_TYPE.POST, true).then(async (post) => {
        const [, categories, tags] = await updateMongoFromMySQL(post)
        await updateArchives(categories, tags)
    })
}

export const updateArchivePosts = async (
    type: ARCHIVE,
    slug: string,
    page: number,
): Promise<T_PostArchive[]> => {
    await auth()
    Cached.getInstance().flush(getCacheKey(COLLECTION.POST))
    Cached.getInstance().flush(getCacheKey(type, slug))

    return await getPostsBy(type, POST_TYPE.POST, slug, page, true).then(
        async (result) => {
            const tags: string[] = []
            const categories: string[] = []
            const posts: T_Post[] = []

            for (const item of result) {
                const [post, cat, tag] = await updateMongoFromMySQL(item)
                posts.push(post)
                categories.push(...cat)
                tags.push(...tag)
            }
            await updateArchives(categories, tags)
            return posts.map((post) => formatArchivePost(post))
        },
    )
}

export const getArchivePosts = async (
    type: string,
    slug: string,
    page: number,
    open: boolean = true,
): Promise<T_PostArchive[]> => {
    const doc: Filter<T_PostArchive> = {
        terms: { $elemMatch: { slug, type } },
    }
    if (open || !(await isAdmin())) doc.status = POST_STATUS.PUBLISH
    return await Mongo.findMany<T_Post>(COLLECTION.POST, doc, {
        sort: { date: -1 },
        limit: PER_PAGE,
        skip: PER_PAGE * (page - 1),
    }).then(async (posts) => posts.map((post) => formatArchivePost(post)))
}

export const getCachedArchivePosts = async (
    type: string,
    slug: string,
    page: number,
): Promise<T_PostArchive[]> => {
    if (type !== ARCHIVE.CATEGORY && type !== ARCHIVE.TAG) {
        throw new Error('Invalid type')
    }

    return await Cached.getInstance().getOrExecute(
        getCacheKey(type, slug, page),
        async () => await getArchivePosts(type, slug, page),
        0,
        IS_DEV,
    )
}

const getPrevNext = async (slug: string): Promise<T_PrevNext[]> => {
    const post = await getCachedPost(slug)
    const slugs = post.terms
        .filter((term) => term.type === 'category')
        .map((category) => category.slug)

    const prev = await Mongo.findMany<T_Post>(
        COLLECTION.POST,
        {
            id: { $ne: post.id },
            status: POST_STATUS.PUBLISH,
            date: { $lt: post.date },
            terms: {
                $elemMatch: {
                    slug: { $in: slugs },
                    type: ARCHIVE.CATEGORY,
                },
            },
        },
        { sort: { date: -1 }, limit: 1 },
    )
    const next = await Mongo.findMany<T_Post>(
        COLLECTION.POST,
        {
            id: { $ne: post.id },
            status: POST_STATUS.PUBLISH,
            date: { $gt: post.date },
            terms: {
                $elemMatch: {
                    slug: { $in: slugs },
                    type: ARCHIVE.CATEGORY,
                },
            },
        },
        { sort: { date: 1 }, limit: 1 },
    )
    return [
        prev[0] && formatPrevNext(prev[0]),
        next[0] && formatPrevNext(next[0]),
    ]
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
        0,
        IS_DEV,
    )

/**
 * Fetches the recent posts from MongoDB.
 *
 * @returns {Promise<T_Post[]>} A promise that resolves to the recent posts.
 */
const getRecentPosts = async (): Promise<T_PostArchive[]> =>
    await Mongo.findMany<T_Post>(
        COLLECTION.POST,
        { status: POST_STATUS.PUBLISH },
        { sort: { date: -1 }, limit: PER_PAGE },
    ).then((posts) => posts.map((post) => formatArchivePost(post)))

/**
 * Fetches the recent posts from the cache or MongoDB.
 * It uses a caching mechanism to avoid fetching the posts multiple times within a week.
 *
 * @returns {Promise<T_Post[]>} A promise that resolves to the recent posts.
 */
export const getCachedRecentPosts = async (): Promise<T_PostArchive[]> =>
    await Cached.getInstance().getOrExecute(
        getCacheKey(COLLECTION.POST, 'recent'),
        async () => await getRecentPosts(),
        0,
        IS_DEV,
    )

/**
 * Fetches the related posts from MongoDB.
 * @param {string} slug
 * @returns {Promise<T_Post[]>} A promise that resolves to the related posts.
 */
const getRelatedPosts = async (slug: string): Promise<T_PostArchive[]> => {
    const post = await getCachedPost(slug)
    const result: Record<number, T_PostArchive> = {}

    const categories = post.terms
        .filter((term) => term.type === 'category')
        .map((category) => category.slug)
    const tags = post.terms
        .filter((term) => term.type === 'tag')
        .map((tag) => tag.slug)

    await Mongo.findMany<T_Post>(
        COLLECTION.POST,
        {
            id: { $ne: post.id },
            status: POST_STATUS.PUBLISH,
            terms: {
                $elemMatch: {
                    slug: { $in: categories },
                    type: ARCHIVE.CATEGORY,
                },
            },
        },
        { sort: { date: -1 }, limit: 4 },
    ).then((posts) =>
        posts.forEach((item) => {
            if (item.id !== post.id) {
                result[item.id] = formatArchivePost(item)
            }
        }),
    )
    if (Object.keys(result).length >= 4) {
        return Object.values(result)
            .sort((a, b) => b.date - a.date)
            .slice(0, 4)
    }

    await Mongo.findMany<T_Post>(
        COLLECTION.POST,
        {
            id: { $ne: post.id },
            status: POST_STATUS.PUBLISH,
            terms: {
                $elemMatch: {
                    slug: { $in: tags },
                    type: ARCHIVE.TAG,
                },
            },
        },
        { sort: { date: -1 }, limit: 4 },
    ).then((posts) =>
        posts.forEach((item) => {
            if (item.id !== post.id) {
                result[item.id] = formatArchivePost(item)
            }
        }),
    )
    if (Object.keys(result).length >= 4) {
        return Object.values(result)
            .sort((a, b) => b.date - a.date)
            .slice(0, 4)
    }

    await getCachedRecentPosts().then((posts) =>
        posts.forEach((item) => {
            if (item.id !== post.id) {
                result[item.id] = formatArchivePost(item)
            }
        }),
    )
    return Object.values(result)
        .sort((a, b) => b.date - a.date)
        .slice(0, 4)
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
): Promise<T_PostArchive[]> =>
    await Cached.getInstance().getOrExecute(
        getCacheKey(COLLECTION.POST, slug, 'related'),
        async () => await getRelatedPosts(slug),
        0,
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
