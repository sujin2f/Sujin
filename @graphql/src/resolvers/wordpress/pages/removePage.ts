import sanitize from 'mongo-sanitize'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
import { Page } from '@src/schema/post'
import Cached from '@sujin/share/model/Cache'
/* CONSTANTS */
import { COLLECTION } from '@sujin/lib/constants'
/* Utils */
import { getCacheKey } from '@sujin/lib/utils/cache'
import { verifyAccessToken, verifyAdmin } from '@src/utils/security'

/**
 * Remove a page document. Requires an admin token.
 *
 * @param _slug - The slug of the page to remove.
 * @param token - Admin GraphQL JWT.
 * @returns An empty array on success.
 */
export const removePage = async (_slug: string, token: string): Promise<boolean[]> => {
    const user = await verifyAccessToken(token)
    await verifyAdmin(user.email)

    const slug = sanitize(_slug)
    await Page.deleteOne({ slug })
    Cached.getInstance().flush(getCacheKey(COLLECTION.PAGE, slug))
    Logger.info(`🤞 removePage mutation done: ${slug}`)
    return []
}
