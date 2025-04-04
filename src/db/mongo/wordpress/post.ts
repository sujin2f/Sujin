import type { Filter, WithId } from 'mongodb'
/* Models */
import Mongo from '@common/data/mongo/mongo'
import Cached from '@common/model/Cached'
/* Utils */
import { getPostsBy } from '@src/db/mysql/post'
import { getCachedTag, updateTagTotal } from '@src/db/mongo/wordpress/tag'
import { convertImageBlockURL } from '@src/utils/wordpress'
import { getCacheKey } from '@src/utils/system'
import {
    getCachedCategory,
    updateCategoryTotal,
} from '@src/db/mongo/wordpress/category'
/* Types */
import {
    ARCHIVE,
    type PostType,
    type MySQLPostType,
    type TermType,
    POST_STATUS,
} from '@src/types/wordpress'
/* Constants */
import { COLLECTION } from '@src/constants/mongo'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import { IS_DEV } from '@common/constants/helper'
import { PER_PAGE } from '@src/constants/mysql-query'

const format = (
    page: WithId<PostType> | PostType | MySQLPostType,
): PostType => ({
    id: page.id,
    slug: page.slug,
    title: page.title,
    excerpt: page.excerpt || '',
    content: page.content,
    date: page.date,
    images: page.images,
    meta: page.meta,
    status: page.status,
    link: page.link,
    terms: page.terms,
})

export const getMySQLArchivePosts = async (
    type: ARCHIVE,
    slug: string,
    page: number,
) => {
    Cached.getInstance().flush(getCacheKey(type, slug))
    const posts: PostType[] = []
    const tags = new Set<string>()
    const categories = new Set<string>()
    await getPostsBy(type, 'post', slug, page).then(async (result) => {
        for (const item of result) {
            const post = format({ ...item, link: `/blog/${item.slug}` })
            Object.keys(post.images).forEach((key) => {
                post.images[key] = convertImageBlockURL(post.images[key])
            })

            await Mongo.findOne<PostType>(COLLECTION.POST, {
                slug: post.slug,
            })
                .then(async () => {
                    await Mongo.replaceOne(
                        COLLECTION.POST,
                        { slug: post.slug },
                        post,
                    )
                    posts.push(post)
                })
                .catch(async () => {
                    await Mongo.insertOne(COLLECTION.POST, post)
                    posts.push(post)
                    post.terms.map((term: TermType) => {
                        if (term.type === 'tag') {
                            tags.add(term.slug)
                        }
                        if (term.type === 'category') {
                            categories.add(term.slug)
                        }
                    })
                })
        }
    })
    for (const item of tags) {
        await getCachedTag(item, true)
        await updateTagTotal(item)
    }
    for (const item of categories) {
        await getCachedCategory(item, true)
        await updateCategoryTotal(item)
    }
    return posts
}

export const getCachedArchivePosts = async (
    type: string,
    slug: string,
    page: number,
): Promise<PostType[]> => {
    if (type !== ARCHIVE.CATEGORY && type !== ARCHIVE.TAG) {
        throw new Error('Invalid type')
    }

    return await Cached.getInstance().getOrExecute(
        getCacheKey(type, slug, page),
        async () =>
            await Mongo.findMany<PostType>(
                COLLECTION.POST,
                {
                    terms: { $elemMatch: { slug, type } },
                },
                {
                    sort: { date: -1 },
                    limit: PER_PAGE,
                    skip: PER_PAGE * (page - 1),
                },
            ).then(async (posts) => posts.map((post) => format(post))),

        WEEK_IN_SECONDS,
        IS_DEV,
    )
}

/**
 * Get single post by slug
 * This returns the cached result if it exists
 *
 * @param {string} slug - Post slug
 * @param {boolean} ignoreStatus - The flag to ignore status
 * @returns {Promise<WithId<WPPost>>} - The post object
 */
export const getCachedPost = async (
    slug: string,
    ignoreStatus: boolean = false,
): Promise<PostType> => {
    const key = getCacheKey(COLLECTION.POST, slug)
    const doc: Filter<PostType> = { slug }
    if (!ignoreStatus) {
        doc.status = POST_STATUS.PUBLISH
    }

    return await Cached.getInstance().getOrExecute(
        key,
        async () =>
            await Mongo.findOne<PostType>(COLLECTION.POST, doc).then((post) =>
                format(post),
            ),
        WEEK_IN_SECONDS,
        IS_DEV,
    )
}

const getPrevNext = async (slug: string): Promise<PostType[]> => {
    const post = await getCachedPost(slug)
    const slugs = post.terms
        .filter((term) => term.type === 'category')
        .map((category) => category.slug)

    const prev = await Mongo.findMany<PostType>(
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
    const next = await Mongo.findMany<PostType>(
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
    return [format(prev[0]), format(next[0])]
}

/**
 * Fetches the recent posts from the cache or MongoDB.
 * This returns the cached result if it exists
 *
 * @param {string} slug - The id of the post
 * @returns {Promise<PostType[]>} A promise that resolves to the recent posts.
 */
export const getCachedPrevNext = async (slug: string): Promise<PostType[]> =>
    await Cached.getInstance().getOrExecute(
        getCacheKey(COLLECTION.POST, slug, 'prev-next'),
        async () => await getPrevNext(slug),
        WEEK_IN_SECONDS,
        IS_DEV,
    )

/**
 * Fetches the recent posts from MongoDB.
 *
 * @returns {Promise<PostType[]>} A promise that resolves to the recent posts.
 */
const getRecentPosts = async (): Promise<PostType[]> =>
    await Mongo.findMany<PostType>(
        COLLECTION.POST,
        { status: POST_STATUS.PUBLISH },
        { sort: { date: -1 }, limit: PER_PAGE },
    ).then((posts) => posts.map((post) => format(post)))

/**
 * Fetches the recent posts from the cache or MongoDB.
 * It uses a caching mechanism to avoid fetching the posts multiple times within a week.
 *
 * @returns {Promise<PostType[]>} A promise that resolves to the recent posts.
 */
export const getCachedRecentPosts = async (): Promise<PostType[]> =>
    await Cached.getInstance().getOrExecute(
        getCacheKey(COLLECTION.POST, 'recent'),
        async () => await getRecentPosts(),
        WEEK_IN_SECONDS,
        IS_DEV,
    )

/**
 * Fetches the related posts from MongoDB.
 * @param {number} id - The ID of the post.
 * @param {string} categories - The categories of the post.
 * @param {string} tags - The tags of the post.
 * @returns {Promise<WithId<Post>[]>} A promise that resolves to the related posts.
 */
const getRelatedPosts = async (slug: string): Promise<PostType[]> => {
    const post = await getCachedPost(slug)
    const result: Record<number, PostType> = {}

    const categories = post.terms
        .filter((term) => term.type === 'category')
        .map((category) => category.slug)
    const tags = post.terms
        .filter((term) => term.type === 'tag')
        .map((tag) => tag.slug)

    await Mongo.findMany<PostType>(
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
                result[item.id] = format(item)
            }
        }),
    )
    if (Object.keys(result).length >= 4) {
        return Object.values(result)
            .sort((a, b) => b.date - a.date)
            .slice(0, 4)
    }

    await Mongo.findMany<PostType>(
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
                result[item.id] = format(item)
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
                result[item.id] = format(item)
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
 * @returns {Promise<PostType[]>} A promise that resolves to the related posts.
 */
export const getCachedRelatedPosts = async (
    slug: string,
): Promise<PostType[]> =>
    await Cached.getInstance().getOrExecute(
        getCacheKey(COLLECTION.POST, slug, 'related'),
        async () => await getRelatedPosts(slug),
        WEEK_IN_SECONDS,
        IS_DEV,
    )
