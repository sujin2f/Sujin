import sanitize from 'mongo-sanitize'
/* Models */
import Logger from '@src/utils/logger'
import { Page } from '@src/schema/post'
/* CONSTANTS */
import { PER_PAGE } from '@sujin/lib/constants'
/* Utils */
import { verifyAdmin } from '@src/utils/security'
/* T_Types */
import type { T_Page } from '@sujin/lib/types'

export const pages = async (
    _page: number,
    token: string,
): Promise<T_Page[]> => {
    verifyAdmin(token, 'pages query has been called by non admin user')

    const page = sanitize(_page)

    const result = await Page.find<T_Page>()
        .sort({ date: -1 })
        .skip(PER_PAGE * (page - 1))
        .limit(PER_PAGE)
    Logger.info(`🤟 pages query done: ${page}`)
    return result
}
