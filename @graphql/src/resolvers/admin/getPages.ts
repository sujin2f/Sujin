/* Models */
import { Logger } from '@sujin/share/model/Logger'
import { Page } from '@src/schema/post'
/* CONSTANTS */
import { PER_PAGE } from '@sujin/lib/constants'
/* Utils */
import { verifyAccessToken, verifyAdmin } from '@src/utils/security'
/* T_Types */
import type { T_Page } from '@sujin/lib/types'
import type { Response } from '@src/types'

/**
 * Admin-only paginated list of pages.
 *
 * Verifies the provided token belongs to an admin, then returns a page of
 * `T_Page` documents.
 *
 * @param _page - Page number (1-based).
 * @param token - GraphQL JWT of the requesting user (must be admin).
 * @returns An array of `T_Page` documents for the requested page.
 * @throws {Error} When the caller is not an admin.
 */
export const getPages = async (page: number, token: string, res: Response): Promise<T_Page[]> => {
    const user = await verifyAccessToken(token)
    await verifyAdmin(user.email)

    const result = await Page.find<T_Page>()
        .sort({ date: -1 })
        .skip(PER_PAGE * (page - 1))
        .limit(PER_PAGE)

    const total = await Page.countDocuments()
    res.setHeader('total-pages', Math.ceil(total / PER_PAGE))
    Logger.info(`🤞 pages query done: ${page}`)
    return result
}
