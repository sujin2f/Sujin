import sanitize from 'mongo-sanitize'
/* Models */
import Logger from '@src/utils/logger'
import { Page } from '@src/schema/post'
import Cached from '@sujin/node-cache'
/* CONSTANTS */
import { COLLECTION } from '@sujin/lib/constants'
/* Utils */
import { getCacheKey } from '@sujin/lib/utils/cache'
import { verifyAdmin } from '@src/utils/security'

export const removePage = async (
    _slug: string,
    token: string,
): Promise<boolean[]> => {
    verifyAdmin(
        token,
        'removePage mutation query has been called by non admin user',
    )
    const slug = sanitize(_slug)
    await Page.deleteOne({ slug })
    await Cached.getInstance().flush(getCacheKey(COLLECTION.PAGE, slug))
    Logger.info(`🤟 removePage mutation done: ${slug}`)
    return []
}
