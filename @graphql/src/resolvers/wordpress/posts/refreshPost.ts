import sanitize from 'mongo-sanitize'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
/* CONSTANTS */
import { POST_TYPE } from '@sujin/lib/constants'
/* Utils */
import { verifyAccessToken, verifyAdmin } from '@src/utils/security'
import { getPostBy } from '@src/utils/mysql/post'
import { updatePost } from '@src/utils/mongo/updatePost'
import { updateTotal } from '@src/utils/mongo/updateTotal'
import { mysqlDisconnect } from '@src/utils/mysql'

/**
 * Get/Update/Remove post(s)
 *
 * @returns {Promise<T_Post[]>}
 */
/**
 * Refresh a single post from MySQL into MongoDB.
 *
 * Steps performed:
 * - Verifies the caller is an admin.
 * - Loads the post from MySQL by `slug`.
 * - Calls `updatePost` to upsert the post into MongoDB and `updateTotal`
 *   to refresh archive totals.
 * - Flushes the post cache and disconnects from MySQL.
 *
 * @param _slug - Post slug to refresh.
 * @param token - Admin GraphQL JWT token.
 * @returns An empty boolean array (placeholder) when done.
 */
export const refreshPost = async (_slug: string, token: string): Promise<boolean[]> => {
    const user = await verifyAccessToken(token)
    await verifyAdmin(user.email)

    const slug = sanitize(_slug)

    await getPostBy('slug', slug, POST_TYPE.POST, true).then(async (post) => {
        const archives = await updatePost(post)
        await updateTotal(archives)
    })
    await mysqlDisconnect()

    Logger.info(`🤞 refreshPost mutation done: ${slug}`)
    return []
}
