import sanitize from 'mongo-sanitize'

/* T_Types */
import type { MutationResultType } from '@src/types'
import type { Context } from '@src/types'
/* Utils */
import { verifyAdmin } from '@src/utils/mongo/verifyUser'
/* Models */
import Logger from '@src/utils/logger'
import { Archive } from '@src/schema/archive'

type Param = {
    slug: string
}

/**
 * Update Mongo Post type from MySQL for GraphQL
 *
 * @returns {Promise<MutationResultType>}
 */
export const removeCategory = async (
    _: unknown,
    { slug: _slug }: Param,
    context: Context,
): Promise<MutationResultType> => {
    if (!(await verifyAdmin(context.token))) {
        Logger.error(
            `⛈️ removeCategory mutation has been called by non admin user`,
        )
        throw new Error(
            `⛈️ removeCategory mutation has been called by non admin user`,
        )
    }

    const slug = sanitize(_slug)
    await Archive.deleteOne({ slug, type: 'category' })
    Logger.info(`🤟 removeCategory mutation has been finished: ${slug}`)
    return {
        result: true,
    }
}
