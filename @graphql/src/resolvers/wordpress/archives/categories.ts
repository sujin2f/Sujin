import sanitize from 'mongo-sanitize'
/* Models */
import Logger from '@src/utils/logger'
import { Archive } from '@src/schema/archive'
/* Utils */
import { verifyAdmin } from '@src/utils/security'
/* CONSTANTS */
import { ARCHIVE, PER_PAGE } from '@sujin/lib/constants'
/* T_Types */
import type { T_Archive } from '@sujin/lib/types'

export const categories = async (
    _page: number,
    token: string,
): Promise<T_Archive[]> => {
    verifyAdmin(token, 'categories query has been called by non admin user')
    const page = sanitize(_page)

    const result = await Archive.find<T_Archive>({ type: ARCHIVE.CATEGORY })
        .sort({ date: -1 })
        .skip(PER_PAGE * (page - 1))
        .limit(PER_PAGE)

    Logger.info(`🤟 archives query done: ${page}`)
    return result
}
