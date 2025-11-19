import sanitize from 'mongo-sanitize'
/* Models */
import { Archive } from '@src/schema/archive'
import Cached from '@sujin/share/model/Cache'
import Logger from '@src/utils/logger'
/* Utils */
import { verifyAdmin } from '@src/utils/security'
import { getCacheKey } from '@sujin/lib/utils/cache'
/* CONSTANTS */
import { COLLECTION, ARCHIVE } from '@sujin/lib/constants'

/**
 * Remove a category archive from MongoDB.
 *
 * This mutation verifies the caller is an admin, deletes the `Archive`
 * document matching the given slug and type `ARCHIVE.CATEGORY`, flushes the
 * related cache entries (the specific archive and the tag-cloud cache), and
 * logs the operation.
 *
 * @param _slug - The category slug to remove.
 * @param token - Admin GraphQL JWT token used for authorization.
 * @returns An empty boolean array (placeholder) upon completion.
 */
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
