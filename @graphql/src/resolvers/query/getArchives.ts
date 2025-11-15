import sanitize from 'mongo-sanitize'
/* Models */
import Logger from '@src/utils/logger'
import { Archive } from '@src/schema/archive'
/* CONSTANTS */
import { verifyAdmin } from '@src/utils/mongo/verifyUser'
import { PER_PAGE } from '@sujin/lib/constants'
import { ARCHIVE, type T_Archive } from '@sujin/lib/types'
/* T_Type */
import type { Context } from '@src/types'

type Props = {
    type: ARCHIVE
    page: number
}

export const getArchives = async (
    _: unknown,
    { type: _type, page: _page }: Props,
    context: Context,
): Promise<T_Archive[]> => {
    if (!(await verifyAdmin(context.token))) {
        Logger.error(`⛈️ getArchives query has been called by non admin user`)
        throw new Error(
            `⛈️ getArchives query has been called by non admin user`,
        )
    }

    const page = sanitize(_page)
    const type = sanitize(_type)
    const list = Archive.find<T_Archive>({ type })
        .sort({ date: -1 })
        .skip(PER_PAGE * (page - 1))
        .limit(PER_PAGE)

    Logger.info(`🤟 getArchives query has been finished`)
    return list
}
