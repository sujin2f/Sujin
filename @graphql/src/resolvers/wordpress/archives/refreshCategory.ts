import sanitize from 'mongo-sanitize'
/**
 * Refresh a WordPress category archive in the MongoDB `Archive` collection.
 *
 * This mutation retrieves the WP term by `slug` from MySQL, converts any
 * WordPress image URLs to the canonical form used by the app, and then
 * inserts or replaces the corresponding Archive document in MongoDB.
 *
 * Side effects:
 * - Verifies the caller is an admin via `verifyAdmin`.
 * - Flushes the cache entry for the archive.
 * - Calls `updateTotal` to update totals that depend on the archive.
 *
 * @param _slug - WordPress term slug identifying the category to refresh.
 * @param token - GraphQL auth token (must belong to an admin user).
 * @returns A promise that resolves to an array of booleans (placeholder).
 */
/* Models */
import { Archive } from '@src/schema/archive'
import Cached from '@sujin/share/model/Cache'
import Logger from '@src/utils/logger'
/* Utils */
import { verifyAdmin } from '@src/utils/security'
import { getCacheKey } from '@sujin/lib/utils/cache'
import { getTermBySlug } from '@src/utils/mysql/term'
import { mysqlDisconnect } from '@src/utils/mysql'
import { convertWPImageURL } from '@src/utils/mongo/convertWPImageURL'
import { updateTotal } from '@src/utils/mongo/updateTotal'
/* CONSTANTS */
import { COLLECTION, ARCHIVE } from '@sujin/lib/constants'

export const refreshCategory = async (
    _slug: string,
    token: string,
): Promise<boolean[]> => {
    const slug = sanitize(_slug)

    verifyAdmin(
        token,
        'refreshCategory mutation has been called by non admin user',
    )

    const wp = await getTermBySlug(slug)
    await mysqlDisconnect()

    if (wp.image) {
        wp.image = convertWPImageURL(wp.image)
    }

    const archive = await Archive.findOneAndReplace(
        { slug },
        { ...wp, type: ARCHIVE.CATEGORY },
    ).then(async (result) => {
        if (!result) {
            return await Archive.insertOne({
                ...wp,
                type: ARCHIVE.CATEGORY,
            })
        }
        return result
    })

    await Cached.getInstance().flush(
        getCacheKey(COLLECTION.ARCHIVE, ARCHIVE.CATEGORY, slug),
    )
    // TODO connect post-category
    await updateTotal([archive._id])
    Logger.info(`🤟 refreshCategory mutation done: ${slug}`)
    return []
}
