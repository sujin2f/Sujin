import type { Filter, WithId } from 'mongodb'
/* Models */
import Mongo from '@common/data/mongo/mongo'
import Cached from '@common/model/Cached'
import Logger from '@common/model/Logger'
/* Utils */
import { getPostBy, getPostsBy } from '@app/_lib/data/mysql/post'
import { updateTag } from '@app/_lib/data/mongo/wordpress/tag'
import { convertImageBlockURL } from '@app/_lib/data/mysql/utils'
import { getCacheKey } from '@app/_lib/utils'
import { updateCategory } from '@app/_lib/data/mongo/wordpress/category'
import { getOption, removeOption } from '@app/_lib/data/mysql/option'
import { MutationResultType } from '@app/api/graphql/constants'
import { formatPostImage } from '@app/_lib/data/mongo/wordpress/util'
/* Types */
import {
    POST_STATUS,
    POST_TYPE,
    type PostType,
    type MySQLPostType,
} from '@app/_lib/data/mysql/types'
/* Constants */
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import { IS_DEV } from '@common/constants/helper'
import { PER_PAGE } from '@app/_lib/data/mysql/constants'
import { ARCHIVE, COLLECTION, POST_IMAGE_LOCATION } from '@app/_lib/data/types'

const format = (
    page: WithId<PostType> | PostType | MySQLPostType,
): PostType => ({
    id: page.id,
    slug: page.slug,
    title: page.title,
    excerpt: page.excerpt || '',
    content: page.content,
    date: page.date,
    images: formatPostImage(page.images),
    meta: page.meta,
    status: page.status,
    link: page.link,
    terms: page.terms.filter(
        (term) => term.type === 'category' || term.type === 'tag',
    ),
})

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
    const doc: Filter<PostType> = { slug }
    if (!ignoreStatus) {
        doc.status = POST_STATUS.PUBLISH
    }

    return await Cached.getInstance().getOrExecute(
        getCacheKey(COLLECTION.POST, slug),
        async () =>
            await Mongo.findOne<PostType>(COLLECTION.POST, doc).then((post) =>
                format(post),
            ),
        WEEK_IN_SECONDS,
        IS_DEV,
    )
}

const updateMongoFromMySQL = async (
    post: MySQLPostType,
): Promise<[PostType, string[], string[]]> => {
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

    await Mongo.findOne<PostType>(COLLECTION.POST, {
        slug,
    })
        .then((result) => {
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
        })
        .catch(() => null)
    await Mongo.deleteOne(COLLECTION.POST, { slug })
    await Mongo.insertOne<PostType>(COLLECTION.POST, format(post))

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

export const updatePost = async (slug: string) => {
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
): Promise<PostType[]> => {
    Cached.getInstance().flush(getCacheKey(COLLECTION.POST))
    Cached.getInstance().flush(getCacheKey(type, slug))

    return await getPostsBy(type, POST_TYPE.POST, slug, page).then(
        async (result) => {
            const tags: string[] = []
            const categories: string[] = []
            const posts: PostType[] = []

            for (const item of result) {
                const [post, cat, tag] = await updateMongoFromMySQL(item)
                posts.push(post)
                categories.push(...cat)
                tags.push(...tag)
            }
            await updateArchives(categories, tags)
            return posts
        },
    )
}

export const getArchivePosts = async (
    type: string,
    slug: string,
    page: number,
): Promise<PostType[]> => {
    return await Mongo.findMany<PostType>(
        COLLECTION.POST,
        {
            terms: { $elemMatch: { slug, type } },
        },
        {
            sort: { date: -1 },
            limit: PER_PAGE,
            skip: PER_PAGE * (page - 1),
        },
    ).then(async (posts) => posts.map((post) => format(post)))
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
        async () => await getArchivePosts(type, slug, page),
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
    return [prev[0] && format(prev[0]), next[0] && format(next[0])]
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
    Logger.server('GQL Server mutatePost: started.')
    const nonceKey = `update_post_${nonce}`
    const nonceValue = await getOption(nonceKey)
    await removeOption(nonceKey)

    if (nonceValue !== `${nonce}-${slug}`) {
        const message = 'GQL Server mutatePost: got invalid nonce.'
        Logger.server(message)
        throw new Error(message)
    }

    await updatePost(slug)
    Logger.server(`GQL Server mutatePost: ${slug} updated.`)

    return {
        result: true,
    }
}
