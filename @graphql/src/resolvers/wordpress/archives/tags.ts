import sanitize from 'mongo-sanitize'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
import { Archive } from '@src/schema/archive'
/* Utils */
import { verifyAccessToken } from '@src/utils/security'
/* CONSTANTS */
import { ARCHIVE, PER_PAGE } from '@sujin/lib/constants'
/* T_Types */
import type { T_Archive } from '@sujin/lib/types'

/**
 * Return a paginated list of tag archives.
 *
 * This resolver requires an admin token and uses simple pagination based on
 * `PER_PAGE`. It returns `T_Archive[]` documents of type `ARCHIVE.TAG`.
 *
 * @param _page - 1-based page index to fetch.
 * @param token - GraphQL auth token (must belong to an admin user).
 * @returns An array of `T_Archive` documents for the requested page.
 */
export const tags = async (_page: number, token: string): Promise<T_Archive[]> => {
    const payload = await verifyAccessToken(token)
    if (!payload.sub.admin) {
        throw new Error('🤬 tags query has been called by non admin user')
    }

    const page = sanitize(_page)

    const result = await Archive.find<T_Archive>({ type: ARCHIVE.TAG })
        .sort({ date: -1 })
        .skip(PER_PAGE * (page - 1))
        .limit(PER_PAGE)

    Logger.info(`🤟 tags query done: ${page}`)
    return result
}
