import { Types } from 'mongoose'
import sanitize from 'mongo-sanitize'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
import Cached from '@sujin/share/model/Cache'
/* CONSTANTS */
import { ARCHIVE, POST_TYPE, COLLECTION } from '@sujin/lib/constants'
/* Utils */
import { getCacheKey } from '@sujin/lib/utils/cache'
import { verifyAccessToken } from '@src/utils/security'
import { getPostsBy } from '@src/utils/mysql/post'
import { updatePost as updateMongoPost } from '@src/utils/mongo/updatePost'
import { updateTotal } from '@src/utils/mongo/updateTotal'
import { mysqlDisconnect } from '@src/utils/mysql'

/**
 * Refresh a page of posts for a given category (`slug`) by fetching them
 * from MySQL and upserting into MongoDB.
 *
 * This mutation:
 * - Validates admin token.
 * - Retrieves a page of posts from MySQL for the given category and page.
 * - Updates MongoDB post documents and archive totals.
 * - Flushes caches and disconnects from MySQL.
 *
 * @param _slug - Category slug whose posts should be refreshed.
 * @param _page - 1-based page number to fetch from MySQL.
 * @param token - Admin GraphQL JWT token.
 * @returns An empty boolean array (placeholder) when done.
 */
export const refreshPosts = async (_slug: string, _page: number, token: string): Promise<boolean[]> => {
    const payload = await verifyAccessToken(token)
    if (!payload.sub.admin) {
        throw new Error('🤬 refreshPosts mutation has been called by non admin user')
    }

    const slug = sanitize(_slug)
    const page = sanitize(_page)

    await getPostsBy(ARCHIVE.CATEGORY, POST_TYPE.POST, slug, page, true).then(async (result) => {
        const archives: Types.ObjectId[] = []
        for (const item of result) {
            archives.push(...(await updateMongoPost(item)))
        }
        await updateTotal(archives)
    })
    await mysqlDisconnect()

    await Cached.getInstance().flush(getCacheKey(COLLECTION.POST))
    Logger.info(`🤟 refreshPosts mutation done: ${slug}`)
    return []
}
