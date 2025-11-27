import { Types } from 'mongoose'
import sanitize from 'mongo-sanitize'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
import Cached from '@sujin/share/model/Cache'
/* CONSTANTS */
import { POST_TYPE, COLLECTION } from '@sujin/lib/constants'
/* Utils */
import { getCacheKey } from '@sujin/lib/utils/cache'
import { verifyAccessToken, verifyAdmin } from '@src/utils/security'
import { getPosts } from '@src/utils/mysql/post'
import { updatePost as updateMongoPost } from '@src/utils/mongo/updatePost'
import { updateTotal } from '@src/utils/mongo/updateTotal'
import { mysqlDisconnect } from '@src/utils/mysql'

/**
 * Refresh a page of all posts (no category filter) by pulling data from MySQL
 * and upserting into MongoDB.
 *
 * Steps:
 * - Verifies admin token.
 * - Loads a page of posts from MySQL.
 * - Updates MongoDB posts and archive totals.
 * - Flushes caches and disconnects from MySQL.
 *
 * @param _page - 1-based page number to fetch from MySQL.
 * @param token - Admin GraphQL JWT token.
 * @returns An empty boolean array (placeholder) when done.
 */
export const refreshPostsAll = async (_page: number, token: string): Promise<boolean[]> => {
    const user = await verifyAccessToken(token)
    await verifyAdmin(user.email)

    const page = sanitize(_page)

    await getPosts(POST_TYPE.POST, page).then(async (result) => {
        const archives: Types.ObjectId[] = []
        for (const item of result) {
            archives.push(...(await updateMongoPost(item)))
        }
        await updateTotal(archives)
    })
    await mysqlDisconnect()

    await Cached.getInstance().flush(getCacheKey(COLLECTION.POST))
    Logger.info(`🤟 refreshPostsAll mutation done: ${page}`)
    return []
}
