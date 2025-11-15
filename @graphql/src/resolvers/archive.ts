import sanitize from 'mongo-sanitize'
import { GraphQLError } from 'graphql'
import type { Document } from 'mongoose'

/* Models */
import Logger from '@src/utils/logger'
import { Archive } from '@src/schema/archive'
/* Utils */
import { verifyAdmin2 } from '@src/utils/mongo/verifyUser'
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'
/* CONSTANTS */
import {
    COLLECTION,
    ARCHIVE,
    GQL_QUERY_TYPE,
    PER_PAGE,
} from '@sujin/lib/constants'
/* T_Types */
import type { GQL_ArchiveArg, GQL_SlugArg, T_Archive } from '@sujin/lib/types'
import type { Context } from '@src/types'
import Cached from '@sujin/node-cache'
import { getTermBySlug } from '@src/utils/mysql/term'
import { mysqlDisconnect } from '@src/utils/mysql'
import { convertWPImageURL } from '@src/utils/mongo/convertWPImageURL'
import { updateTotal } from '@src/utils/mongo/updateTotal'

/**
 * Get archive(s)
 *
 * QT: queryType
 * Item: slug & type & QT = QUERY -- (caching)
 * List: type & page & QT = QUERY -- (admin)
 * Update: slug & type & QT = UPDATE -- (admin)
 * Remove: slug & type & QT = REMOVE -- (admin)
 *
 * @returns {Promise<T_Archive[]>}
 */
export const archive = async (
    {
        slug: _slug,
        archiveType: _type,
        page: _page,
        query: _query,
    }: GQL_ArchiveArg,
    context: Context,
): Promise<T_Archive[]> => {
    const slug = sanitize(_slug)
    const type = sanitize(_type)
    const page = sanitize(_page)
    const query = sanitize(_query)

    if (query === GQL_QUERY_TYPE.QUERY && slug && type && !page) {
        return await getSingle(slug, type)
    }

    if (query === GQL_QUERY_TYPE.QUERY && type && page && !slug) {
        return await getList(type, page, context.token)
    }

    if (query === GQL_QUERY_TYPE.UPDATE && slug && type && !page) {
        return await update(slug, type, context.token)
    }

    if (query === GQL_QUERY_TYPE.REMOVE && slug && type && !page) {
        return await remove(slug, type, context.token)
    }

    Logger.info(
        `🤟 archive query has been finished: ${slug}, ${type}, ${page}, ${query}`,
    )
    throw new Error()
}

const getSingle = async (slug: string, type: ARCHIVE) => {
    const request = cachedRequest(
        async (type: string, slug: string): Promise<T_Archive> => {
            return await Archive.findOne<Document<string, unknown, T_Archive>>({
                type,
                slug,
            }).then((result) => {
                if (!result) {
                    throw new GraphQLError(
                        `Cannot find archive ${type} ${slug}`,
                        {
                            extensions: {
                                code: 'NO_CONTENT',
                            },
                        },
                    )
                }
                return result.toObject()
            })
        },
        getCacheKey(COLLECTION.ARCHIVE, type, slug), // TODO Check cache keys
    )
    const result = await request(type, slug)
    return [result]
}

const getList = async (type: ARCHIVE, page: number, token: string) => {
    verifyAdmin2(token, 'archive list query has been called by non admin user')
    return Archive.find<Document<string, unknown, T_Archive>>({ type })
        .sort({ date: -1 })
        .skip(PER_PAGE * (page - 1))
        .limit(PER_PAGE)
        .then((result) => {
            return result.map((item) => item.toObject())
        })
}

const update = async (slug: string, type: ARCHIVE, token: string) => {
    verifyAdmin2(
        token,
        'archive update mutation has been called by non admin user',
    )
    await Cached.getInstance().flush(
        getCacheKey(COLLECTION.ARCHIVE, type, slug),
    )

    const wp = await getTermBySlug(slug)
    await mysqlDisconnect()

    if (wp.image) {
        wp.image = convertWPImageURL(wp.image)
    }

    const archive = await Archive.findOneAndReplace(
        { slug, type },
        { ...wp, type },
    ).then(async (result) => {
        if (!result) {
            return await Archive.insertOne({ ...wp, type })
        }
        return result
    })

    await updateTotal([archive._id])
    return []
}

const remove = async (slug: string, type: ARCHIVE, token: string) => {
    verifyAdmin2(
        token,
        'archive remove mutation has been called by non admin user',
    )
    await Archive.deleteOne({ slug, type: 'category' })
    return []
}

export const updateHits = async (_: unknown, { slug: _slug }: GQL_SlugArg) => {
    const slug = sanitize(_slug)
    await Archive.updateOne({ slug, type: ARCHIVE.TAG }, { $inc: { hits: 1 } })

    Logger.info(`🤟 updateHits mutation has been finished: ${_slug}`)
    return {
        result: true,
    }
}
