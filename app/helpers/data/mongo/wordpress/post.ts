import type { Filter, WithId } from 'mongodb'
/* Models */
import Mongo from '@common/data/mongo/mongo'
import Cached from '@common/model/Cached'
/* Utils */
import { getPostBy, getPostsBy } from '@app/helpers/data/mysql/post'
import {
    getCachedTag,
    updateTagTotal,
} from '@app/helpers/data/mongo/wordpress/tag'
import { convertImageBlockURL } from '@app/helpers/utils/wordpress'
import { getCacheKey } from '@app/helpers/utils/system'
import {
    getCachedCategory,
    updateCategoryTotal,
} from '@app/helpers/data/mongo/wordpress/category'
/* Types */
import {
    ARCHIVE,
    type PostType,
    type MySQLPostType,
    type TermType,
    POST_STATUS,
} from '@app/helpers/types/wordpress'
/* Constants */
import { COLLECTION } from '@app/helpers/constants/mongo'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import { IS_DEV } from '@common/constants/helper'
import { PER_PAGE } from '@app/helpers/constants/mysql-query'
import { MutationResultType } from '@app/helpers/constants/graphql'
import { getOption, removeOption } from '@app/helpers/data/mysql/option'
import Logger from '@common/model/Logger'

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
    terms: page.terms.filter(
        (term) => term.type === 'category' || term.type === 'tag',
    ),
})

const updateMySQLPost = async (
    item: MySQLPostType,
): Promise<[PostType, string[], string[]]> => {
    const post = format({ ...item, link: `/blog/${item.slug}` })
    Object.keys(post.images).forEach((key) => {
        post.images[key] = convertImageBlockURL(post.images[key])
    })

    const tags: string[] = []
    const categories: string[] = []

    const result = await Mongo.findOne<PostType>(COLLECTION.POST, {
        slug: post.slug,
    })
        .then(async () => {
            await Mongo.replaceOne(
                COLLECTION.POST,
                { slug: post.slug },
                post,
            ).catch((e) => {
                Logger.server(`Failed to update post ${post.slug}`)
                console.log(post)
                throw e
            })
            return post
        })
        .catch(async () => {
            await Mongo.insertOne(COLLECTION.POST, post).catch((e) => {
                Logger.server(`Failed to insert post ${post.slug}`)
                console.log(post)
                throw e
            })
            post.terms.map((term: TermType) => {
                if (term.type === 'tag') {
                    tags.push(term.slug)
                }
                if (term.type === 'category') {
                    categories.push(term.slug)
                }
            })
            return post
        })

    return [result, categories, tags]
}

export const getMySQLArchivePosts = async (
    type: ARCHIVE,
    slug: string,
    page: number,
) => {
    Cached.getInstance().flush(getCacheKey(type, slug))
    const posts: PostType[] = []
    const tags: string[] = []
    const categories: string[] = []

    await getPostsBy(type, 'post', slug, page).then(async (result) => {
        for (const item of result) {
            const [post, c, t] = await updateMySQLPost(item)
            posts.push(post)
            tags.push(...c)
            categories.push(...t)
        }
    })

    for (const item of Array.from(new Set(tags))) {
        await getCachedTag(item, true)
        await updateTagTotal(item)
    }
    for (const item of Array.from(new Set(categories))) {
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

export const mutatePost = async (
    nonce: string,
    slug: string,
): Promise<MutationResultType> => {
    const nonceKey = `update_post_${nonce}`
    const nonceValue = await getOption(nonceKey)
    await removeOption(nonceKey)

    if (nonceValue !== `${nonce}-${slug}`) {
        Logger.server('Invalid nonce')
        throw new Error('Invalid nonce')
    }

    await getPostBy('slug', slug, 'post', true).then(async (result) => {
        const [, cats, tags] = await updateMySQLPost(result)

        for (const item of tags) {
            await getCachedTag(item, true)
            await updateTagTotal(item)
        }
        for (const item of cats) {
            await getCachedCategory(item, true)
            await updateCategoryTotal(item)
        }
    })

    Cached.getInstance().flush(getCacheKey(COLLECTION.POST, slug))
    Logger.server(`Post ${slug} updated.`)

    return {
        result: true,
    }
}
