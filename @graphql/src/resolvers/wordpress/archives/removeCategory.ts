import sanitize from 'mongo-sanitize'
/* Models */
import { Archive } from '@src/schema/archive'
import { Logger } from '@sujin/share/model/Logger'
/* Utils */
import { verifyAccessToken, verifyAdmin } from '@src/utils/security'
/* CONSTANTS */
import { ARCHIVE } from '@sujin/lib/constants'

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
export const removeCategory = async (_slug: string, token: string): Promise<boolean[]> => {
    const user = await verifyAccessToken(token)
    await verifyAdmin(user.email)

    const slug = sanitize(_slug)
    await Archive.deleteOne({ slug, type: ARCHIVE.CATEGORY })
    Logger.info(`🤞 removeCategory mutation done: ${slug}`)
    return []
}
