import sanitize from 'mongo-sanitize'
/* Models */
import { Logger } from '@common/model/Logger'
import { Archive } from '@src/schema/archive'
/* Utils */
import { verifyAccessToken, verifyAdmin } from '@src/utils/security'
/* CONSTANTS */
import { ARCHIVE, PER_PAGE } from '@common/constants'
/* T_Types */
import type { T_Archive } from '@common/types'

/**
 * Return a paginated list of category archives.
 *
 * Requires an admin token. Uses `PER_PAGE` for pagination and returns
 * `T_Archive[]` documents of type `ARCHIVE.CATEGORY`.
 *
 * @param _page - 1-based page index to fetch.
 * @param token - GraphQL auth token (must belong to an admin user).
 * @returns An array of `T_Archive` documents for the requested page.
 */
export const categories = async (_page: number, token: string): Promise<T_Archive[]> => {
    const user = await verifyAccessToken(token)
    await verifyAdmin(user.email)

    const page = sanitize(_page)

    const result = await Archive.find<T_Archive>({ type: ARCHIVE.CATEGORY })
        .sort({ date: -1 })
        .skip(PER_PAGE * (page - 1))
        .limit(PER_PAGE)

    Logger.info(`🤞 archives query done: ${page}`)
    return result
}
