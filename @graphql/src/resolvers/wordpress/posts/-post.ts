import { type Document, Types, type RootFilterQuery } from 'mongoose'
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
import { DAY_IN_MS } from '@sujin/share/constants/datetime'
/* Utils */
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'
import { isSearch } from '@src/utils/mongo/isSearch'
import { verifyAdmin } from '@src/utils/mongo/security'
import { getPostBy, getPosts, getPostsBy } from '@src/utils/mysql/post'
import { updatePost as updateMongoPost } from '@src/utils/mongo/updatePost'
import { updateTotal } from '@src/utils/mongo/updateTotal'
import { mysqlDisconnect } from '@src/utils/mysql'
import { convertWPImageURL } from '@src/utils/mongo/convertWPImageURL'
import { archive as getArchive } from '@src/resolvers/wordpress/archives/-archive'
/* T_Types */
import type { Context } from '@src/types'
import type {
    GQL_PostArg,
    T_ArchivePost,
    T_Page,
    T_Post,
} from '@sujin/lib/types'

/**
 * Get/Update/Remove post(s)
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
    Logger.info(
        `👁️‍🗨️ post query triggered: ${_slug}, ${_type}, ${_page}, ${_category}, ${_query}`,
    )

    const query = sanitize(_query)
    const token = context.token

    // Admin Requests
    if (
        query === GQL_QUERY_TYPE.QUERY_ADMIN ||
        query === GQL_QUERY_TYPE.UPDATE ||
        query === GQL_QUERY_TYPE.REMOVE
    ) {
        verifyAdmin(token, 'post query has been called by non admin user')
    }

    const slug = sanitize(_slug)
    const type = sanitize(_type)

    const isPage = type === POST_TYPE.PAGE
    const isQuery = query === GQL_QUERY_TYPE.QUERY
    const isAdminQuery = query === GQL_QUERY_TYPE.QUERY_ADMIN

    // get Page (admin)
    if (isAdminQuery && slug && isPage && token) {
        const result = await getPage({ slug })
        Logger.info(`🤟 page query done: ${slug}`)
        return [result]
    }
    // get Page
    if (isQuery && slug && isPage) {
        const result = await getPage({
            slug,
            status: POST_STATUS.PUBLISH,
        })
        Logger.info(`🤟 page query done: ${slug}`)
        return [result]
    }

    const isPost = type === POST_TYPE.POST

    // get Post (admin) !!
    if (isAdminQuery && slug && isPost && token) {
        const result = await getPost({ slug })
        Logger.info(`🤟 post query done: ${slug}`)
        return [result]
    }
    // get Post !!
    if (isQuery && slug && isPost) {
        const result = await getPost({
            slug,
            status: POST_STATUS.PUBLISH,
        })
        Logger.info(`🤟 post query done: ${slug}`)
        return [result]
    }

    const category = sanitize(_category)
    const page = sanitize(_page)

    // Post List by Category --
    if (isQuery && isPost && page && category) {
        const doc = await getPostListDoc(category)
        doc.status = POST_STATUS.PUBLISH

        const result = await getCachedPostList(doc, category, page)
        Logger.info(`🤟 post list query done: ${page}, ${category}`)
        return result
    }
    // Post List by Category (Admin) --
    if (isAdminQuery && isPost && page && category) {
        const doc = await getPostListDoc(category)
        const result = await getPostList(doc, category, page)
        Logger.info(`🤟 post list query done: ${page}, ${category}`)
        return result
    }
    // Post List all (Admin) --
    if (isAdminQuery && isPost && page) {
        const result = await getPostList({}, 'all', page)
        Logger.info(`🤟 post list query done: ${page}, ${category}`)
        return result
    }
    // Page List (Admin)
    if (isAdminQuery && isPage && page) {
        const result = await getPageList(page)
        Logger.info(`🤟 page list query done: ${page}`)
        return result
    }

    const isUpdate = query === GQL_QUERY_TYPE.UPDATE

    // Page Update
    if (isUpdate && slug && isPage) {
        const result = await updatePage(slug)
        Logger.info(`🤟 page update done: ${slug}`)
        return result
    }
    // Post Update --
    if (isUpdate && slug && isPost) {
        const result = await updatePost(slug)
        Logger.info(`🤟 post update done: ${slug}`)
        return result
    }
    // Post Update by category --
    if (isUpdate && category && page && isPost) {
        const result = await updatePostsByCategory(category, page)
        Logger.info(`🤟 posts update done: ${page}, ${category}`)
        return result
    }
    // Post Update (all) --
    if (isUpdate && page && isPost) {
        const result = await updatePosts(page)
        Logger.info(`🤟 posts update done: ${page}, ${category}`)
        return result
    }

    const isRemove = query === GQL_QUERY_TYPE.REMOVE

    // Remove one
    if (isRemove && slug && type) {
        const result = await removeOne(slug, type)
        Logger.info(`🤟 post remove done: ${slug}, ${type}`)
        return result
    }

    Logger.error(
        `🤬 post query has been called with nothing: ${slug}, ${type}, ${page}, ${category}, ${query}`,
    )
    throw new Error()
}

type GetSingleDocType = RootFilterQuery<T_Page> & { slug: string }
type GetListDocType = RootFilterQuery<T_Page>

/**
 * @returns {Promise<T_Post>}
 */
const getPage = async (doc: GetSingleDocType): Promise<T_Page> => {
    const request = cachedRequest(
        async (doc: GetSingleDocType): Promise<T_Page> => {
            return await Page.findOne<Document<string, unknown, T_Page>>(
                doc,
            ).then((result) => {
                if (!result) {
                    throw new GraphQLError(`Cannot find the page ${doc.slug}`, {
                        extensions: {
                            code: 'NO_CONTENT',
                        },
                    })
                }

                return result.toObject()
            })
        },
        getCacheKey(COLLECTION.POST, doc.slug, POST_TYPE.PAGE),
    )
    return await request(doc)
}

/**
 * @returns {Promise<T_Post>}
 */
const getPost = async (doc: GetSingleDocType): Promise<T_Post> => {
    const request = cachedRequest(
        async (doc: GetSingleDocType): Promise<T_Post> => {
            return await Post.aggregate<T_Post>([
                {
                    $match: doc,
                },
                ...AGGREGATE_EXPAND_ARCHIVES,
            ]).then((result) => {
                if (!result || !result.length) {
                    throw new GraphQLError(`Cannot find the post ${doc.slug}`, {
                        extensions: {
                            code: 'NO_CONTENT',
                        },
                    })
                }
                return result[0]
            })
        },
        getCacheKey(COLLECTION.POST, doc.slug, POST_TYPE.POST),
    )
    return await request(doc)
}

const getPostListDoc = async (category: string) => {
    const [slug, search] = isSearch(category)
    const doc: Record<string, unknown> = {}

    if (search) {
        doc['$text'] = { $search: slug }
    } else {
        const archive = await getArchive(
            {
                slug,
                archiveType: ARCHIVE.CATEGORY,
                query: GQL_QUERY_TYPE.QUERY,
            },
            { token: '' },
        )
        doc.archives = { $in: [new Types.ObjectId(archive[0]._id)] }
    }
    return doc
}

const getCachedPostList = async (
    doc: GetListDocType,
    category: string,
    page: number,
): Promise<T_ArchivePost[]> => {
    const request = cachedRequest(
        getPostList,
        getCacheKey(COLLECTION.ARCHIVE, category, page),
    )

    const result = await request(doc, category, page)
    return result
}

const getPostList = async (
    doc: GetListDocType,
    category: string,
    page: number,
): Promise<T_ArchivePost[]> => {
    return await Post.aggregate([
        { $match: doc },
        { $sort: { date: -1 } },
        { $skip: PER_PAGE * (page - 1) },
        { $limit: PER_PAGE },
        ...AGGREGATE_EXPAND_ARCHIVES,
        ...AGGREGATE_ARCHIVE_POST,
    ]).then((result) => {
        if (!result || !result.length) {
            throw new GraphQLError(
                `Cannot find the post from archive ${category}`,
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

const getPageList = async (page: number): Promise<T_Page[]> => {
    return Page.find<T_Page>()
        .sort({ date: -1 })
        .skip(PER_PAGE * (page - 1))
        .limit(PER_PAGE)
}

const updatePost = async (slug: string): Promise<[]> => {
    Cached.getInstance().flush(getCacheKey(COLLECTION.POST, slug))
    await getPostBy('slug', slug, POST_TYPE.POST, true).then(async (post) => {
        const archives = await updateMongoPost(post)
        await updateTotal(archives)
    })
    await mysqlDisconnect()

    return []
}

const updatePage = async (slug: string): Promise<[]> => {
    const page = await getPostBy('slug', slug, POST_TYPE.PAGE)
    const date = Math.trunc(page.date.getTime() / DAY_IN_MS)

    await Cached.getInstance().flush(getCacheKey(COLLECTION.PAGE, slug))
    await mysqlDisconnect()
    if (page.images) {
        Object.keys(page.images).forEach((key) => {
            const imageKey = key as POST_IMAGE_LOCATION
            page.images[imageKey] = convertWPImageURL(page.images[imageKey]!)
        })
    }

    await Page.findOneAndReplace({ slug }, { ...page, date }).then(
        async (result) => {
            if (!result) {
                await Page.insertOne({ ...page, date })
            }
        },
    )
    return []
}

const updatePostsByCategory = async (
    category: string,
    page: number,
): Promise<[]> => {
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

const updatePosts = async (page: number): Promise<[]> => {
    Cached.getInstance().flush(getCacheKey(COLLECTION.POST))
    Cached.getInstance().flush(getCacheKey(COLLECTION.ARCHIVE))

    await getPosts(POST_TYPE.POST, page).then(async (result) => {
        const archives: Types.ObjectId[] = []
        for (const item of result) {
            archives.push(...(await updateMongoPost(item)))
        }
        await updateTotal(archives)
    })
    await mysqlDisconnect()
    return []
}

const removeOne = async (slug: string, type: POST_TYPE): Promise<[]> => {
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
