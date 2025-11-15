import sanitize from 'mongo-sanitize'
/* Models */
import Logger from '@src/utils/logger'
/* CONSTANTS */
import { verifyAdmin } from '@src/utils/mongo/verifyUser'
/* T_Type */
import type { Context } from '@src/types'
import { Page } from '@src/schema/post'
import { T_Page } from '@sujin/lib/types'
import { PER_PAGE } from '@sujin/lib/constants'

type Props = {
    page: number
}

export const getPages = async (
    _: unknown,
    { page: _page }: Props,
    context: Context,
): Promise<T_Page[]> => {
    if (!(await verifyAdmin(context.token))) {
        Logger.error(`⛈️ getPages query has been called by non admin user`)
        throw new Error(`⛈️ flushDB mutation has been called by non admin user`)
    }

    const page = sanitize(_page)
    const list = Page.find<T_Page>()
        .sort({ date: -1 })
        .skip(PER_PAGE * (page - 1))
        .limit(PER_PAGE)

    Logger.info(`🤟 getPages query has been finished`)
    return list
}
