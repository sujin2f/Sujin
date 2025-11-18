import sanitize from 'mongo-sanitize'
/* Models */
import { Archive } from '@src/schema/archive'
import Cached from '@sujin/node-cache'
import Logger from '@src/utils/logger'
/* Utils */
import { verifyAdmin } from '@src/utils/security'
import { getCacheKey } from '@sujin/lib/utils/cache'
/* CONSTANTS */
import { COLLECTION, ARCHIVE } from '@sujin/lib/constants'

export const removeCategory = async (
    _slug: string,
    token: string,
): Promise<boolean[]> => {
    const slug = sanitize(_slug)
    verifyAdmin(
        token,
        'removeCategory mutation has been called by non admin user',
    )
    await Archive.deleteOne({ slug, type: ARCHIVE.CATEGORY })
    await Cached.getInstance().flush(
        getCacheKey(COLLECTION.ARCHIVE, ARCHIVE.CATEGORY, slug),
        getCacheKey(COLLECTION.ARCHIVE, 'tag-cloud'),
    )
    Logger.info(`🤟 removeCategory mutation done: ${slug}`)
    return []
}
