import { Types, type RootFilterQuery } from 'mongoose'
import { GraphQLError } from 'graphql'
import sanitize from 'mongo-sanitize'
/* Models */
import Logger from '@src/utils/logger'
import { Post } from '@src/schema/post'
/* CONSTANTS */
import {
    ARCHIVE,
    GQL_QUERY_TYPE,
    PER_PAGE,
    COLLECTION,
    POST_STATUS,
} from '@sujin/lib/constants'
import {
    AGGREGATE_ARCHIVE_POST,
    AGGREGATE_EXPAND_ARCHIVES,
} from '@src/constants'
/* Utils */
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'
import { verifyAdmin } from '@src/utils/mongo/security'
import { archive as getArchive } from '@src/resolvers/wordpress/archives/-archive'
/* T_Types */
import type { T_Page, T_Post } from '@sujin/lib/types'

/**
 * Get/Update/Remove post(s)
 *
 * @returns {Promise<T_Post[]>}
 */
export const posts = async (
    _slug: string, // TODO when slug is empty
    _page: number,
    isAdmin: boolean,
    token: string,
): Promise<T_Post[]> => {
    const slug = sanitize(_slug)
    const page = sanitize(_page)

    type Match = RootFilterQuery<T_Page>
    const $match: Match = {}

    if (isAdmin) verifyAdmin(token, 'posts has been called by non admin user')

    if (!isAdmin) $match.status = POST_STATUS.PUBLISH

    const archive = await getArchive(
        {
            slug,
            archiveType: ARCHIVE.CATEGORY,
            query: GQL_QUERY_TYPE.QUERY,
        },
        { token: '' },
    )
    $match.archives = { $in: [new Types.ObjectId(archive[0]._id)] }

    const callback = async (): Promise<T_Post[]> =>
        await Post.aggregate<T_Post>([
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

    const request = isAdmin
        ? callback
        : cachedRequest(callback, getCacheKey(COLLECTION.POST, slug, page))
    const result = await request()

    Logger.info(`🤟 posts done: ${slug}, ${page}`)
    return result
}
