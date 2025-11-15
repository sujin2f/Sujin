import { Document, Types } from 'mongoose'
import { GraphQLError } from 'graphql'
import sanitize from 'mongo-sanitize'
/* Models */
import Logger from '@src/utils/logger'
import { Page, Post } from '@src/schema/post'
import Cached from '@sujin/node-cache'
/* CONSTANTS */
import {
    ARCHIVE,
    GQL_QUERY_TYPE,
    PER_PAGE,
    POST_TYPE,
    POST_IMAGE_LOCATION,
    COLLECTION,
    POST_STATUS,
} from '@sujin/lib/constants'
import {
    AGGREGATE_ARCHIVE_POST,
    AGGREGATE_EXPAND_ARCHIVES,
} from '@src/constants'
/* Utils */
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'
import { isSearch } from '@src/utils/mongo/isSearch'
import { verifyAdmin2 } from '@src/utils/mongo/verifyUser'
import { getPostBy, getPostsBy } from '@src/utils/mysql/post'
import { updatePost as updateMongoPost } from '@src/utils/mongo/updatePost'
import { updateTotal } from '@src/utils/mongo/updateTotal'
import { mysqlDisconnect } from '@src/utils/mysql'
import { convertWPImageURL } from '@src/utils/mongo/convertWPImageURL'
import { archive as getArchive } from '@src/resolvers/archive'
/* T_Types */
import type { Context } from '@src/types'
import type {
    GQL_PostArg,
    T_ArchivePost,
    T_Page,
    T_Post,
} from '@sujin/lib/types'

/**
 * Get post(s)
 *
 * QT: queryType
 * Item: slug & type & QT = QUERY -- (caching)
 * List post: type & page & category & QT = QUERY -- (admin/caching)
 * List page: type & page & QT = QUERY -- (admin/caching)
 * Update one: slug & type & QT = UPDATE -- (admin)
 * Update many: category & page & QT = UPDATE -- (admin)
 * Remove: slug & type & QT = REMOVE -- (admin)
 *
 * @returns {Promise<T_Post[]>}
 */
export const post = async (
    {
        slug: _slug,
        postType: _type,
        category: _category,
        page: _page,
        query: _query,
    }: GQL_PostArg,
    context: Context,
): Promise<(T_Post | T_Page | T_ArchivePost)[]> => {
    const slug = sanitize(_slug)
    const type = sanitize(_type)
    const category = sanitize(_category)
    const page = sanitize(_page)
    const query = sanitize(_query)

    if (query === GQL_QUERY_TYPE.QUERY && slug && type) {
        return await getSingle(slug, type)
    }

    if (
        query === GQL_QUERY_TYPE.QUERY &&
        type === POST_TYPE.POST &&
        page &&
        category
    ) {
        return await getPostList(category, page, context.token)
    }

    if (query === GQL_QUERY_TYPE.QUERY && type === POST_TYPE.PAGE && page) {
        return await getPageList(page, context.token)
    }

    if (query === GQL_QUERY_TYPE.UPDATE && slug && type) {
        switch (type) {
            case POST_TYPE.POST:
                return await updatePost(slug, context.token)
            case POST_TYPE.PAGE:
                return await updatePage(slug, context.token)
        }
    }

    if (query === GQL_QUERY_TYPE.UPDATE && category && page) {
        return await updateMany(category, page, context.token)
    }

    if (query === GQL_QUERY_TYPE.REMOVE && slug && type) {
        return await remove(slug, type, context.token)
    }

    Logger.info(
        `🤟 post query has been finished: ${slug}, ${type}, ${page}, ${category}, ${query}`,
    )
    throw new Error()
}

// recent: [Post]
// prevNext(slug: String!): [Post]
// related(slug: String!): [Post]

/**
 * @returns {Promise<T_Post[]>}
 */
const getSingle = async (
    slug: string,
    type: POST_TYPE,
): Promise<(T_Post | T_Page)[]> => {
    const request = cachedRequest(
        async (slug: string, type: POST_TYPE): Promise<T_Post | T_Page> => {
            // Page
            if (type === POST_TYPE.PAGE) {
                return await Page.findOne<Document<string, unknown, T_Page>>({
                    slug,
                    status: POST_STATUS.PUBLISH,
                }).then((result) => {
                    if (!result) {
                        throw new GraphQLError(`Cannot find the page ${slug}`, {
                            extensions: {
                                code: 'NO_CONTENT',
                            },
                        })
                    }

                    return result.toObject()
                })
            }

            // Post
            return await Post.aggregate<T_Post>([
                {
                    $match: { status: POST_STATUS.PUBLISH, slug },
                },
                ...AGGREGATE_EXPAND_ARCHIVES,
            ]).then((result) => {
                if (!result || !result.length) {
                    throw new GraphQLError(`Cannot find the post ${slug}`, {
                        extensions: {
                            code: 'NO_CONTENT',
                        },
                    })
                }
                return result[0]
            })
        },
        getCacheKey(COLLECTION.POST, slug, type),
    )
    const result = await request(slug, type)
    return [result]
}

/**
 * Get archive
 * This returns the cached result if it exists
 *
 * @returns {Promise<T_ArchivePost[]>} - The background array
 */
const getPostList = async (
    category: string,
    page: number,
    token: string,
): Promise<T_ArchivePost[]> => {
    const [slug, search] = isSearch(category)

    let request: typeof queryPostList

    if (token) {
        verifyAdmin2(token, 'post list query has been called by non admin user')
        request = queryPostList
    } else {
        request = cachedRequest(
            queryPostList,
            getCacheKey(COLLECTION.ARCHIVE, slug, page, search),
        )
    }

    const result = await request(slug, page, search, token)
    return result
}

const queryPostList = async (
    slug: string,
    page: number,
    search: number,
    token: string,
): Promise<T_ArchivePost[]> => {
    let $match: Record<string, unknown>
    if (search) {
        $match = {
            $text: { $search: slug },
        }
    } else {
        const archive = await getArchive(
            {
                slug,
                archiveType: ARCHIVE.CATEGORY,
                query: GQL_QUERY_TYPE.QUERY,
            },
            { token: '' },
        )
        $match = {
            archives: { $in: [new Types.ObjectId(archive[0]._id)] },
        }
    }

    if (!token) {
        $match.status = POST_STATUS.PUBLISH
    }

    return await Post.aggregate([
        { $match },
        { $sort: { date: -1 } },
        { $skip: PER_PAGE * (page - 1) },
        { $limit: PER_PAGE },
        ...AGGREGATE_EXPAND_ARCHIVES,
        ...AGGREGATE_ARCHIVE_POST,
    ]).then((result) => {
        if (!result || !result.length) {
            throw new GraphQLError(
                `Cannot find the post from archive ${slug}`,
                {
                    extensions: {
                        code: 'NO_CONTENT',
                    },
                },
            )
        }
        return result
    })
}

const getPageList = async (page: number, token: string): Promise<T_Page[]> => {
    verifyAdmin2(token, 'page list query has been called by non admin user')

    return Page.find<T_Page>()
        .sort({ date: -1 })
        .skip(PER_PAGE * (page - 1))
        .limit(PER_PAGE)
}

const updatePost = async (slug: string, token: string): Promise<[]> => {
    verifyAdmin2(token, 'post update query has been called by non admin user')

    Cached.getInstance().flush(getCacheKey(COLLECTION.POST, slug))
    await getPostBy('slug', slug, POST_TYPE.POST, true).then(async (post) => {
        const archives = await updateMongoPost(post)
        await updateTotal(archives)
    })
    await mysqlDisconnect()

    return []
}

const updatePage = async (slug: string, token: string): Promise<[]> => {
    verifyAdmin2(token, 'page update query has been called by non admin user')

    const page = await getPostBy('slug', slug, POST_TYPE.PAGE)

    await Cached.getInstance().flush(getCacheKey(COLLECTION.PAGE, slug))
    await mysqlDisconnect()
    if (page.images) {
        Object.keys(page.images).forEach((key) => {
            const imageKey = key as POST_IMAGE_LOCATION
            page.images[imageKey] = convertWPImageURL(page.images[imageKey]!)
        })
    }

    await Page.findOneAndReplace({ slug }, page).then(async (result) => {
        if (!result) {
            await Page.insertOne(page)
        }
    })
    return []
}

const updateMany = async (
    category: string,
    page: number,
    token: string,
): Promise<[]> => {
    verifyAdmin2(token, 'posts update query has been called by non admin user')

    Cached.getInstance().flush(getCacheKey(COLLECTION.POST))
    Cached.getInstance().flush(
        getCacheKey(COLLECTION.ARCHIVE, 'category', category),
    )

    await getPostsBy(
        ARCHIVE.CATEGORY,
        POST_TYPE.POST,
        category,
        page,
        true,
    ).then(async (result) => {
        const archives: Types.ObjectId[] = []
        for (const item of result) {
            archives.push(...(await updateMongoPost(item)))
        }
        await updateTotal(archives)
    })
    await mysqlDisconnect()

    return []
}

const remove = async (
    slug: string,
    type: POST_TYPE,
    token: string,
): Promise<[]> => {
    verifyAdmin2(token, 'post remove query has been called by non admin user')

    switch (type) {
        case POST_TYPE.POST:
            await Post.deleteOne({ slug })
            return []
        case POST_TYPE.PAGE:
            await Page.deleteOne({ slug })
            return []
    }
    return []
}
