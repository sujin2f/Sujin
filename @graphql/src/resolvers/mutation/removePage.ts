/* T_Types */
import type { MutationResultType } from '@src/types'
import type { Context } from '@src/types'
/* Utils */
import { verifyAdmin } from '@src/utils/mongo/verifyUser'
/* Models */
import Logger from '@src/utils/logger'
import { Page } from '@src/schema/post'

type Param = {
    slug: string
}

/**
 * Update Mongo Post type from MySQL for GraphQL
 *
 * @returns {Promise<MutationResultType>}
 */
export const removePage = async (
    _: unknown,
    { slug }: Param,
    context: Context,
): Promise<MutationResultType> => {
    if (!(await verifyAdmin(context.token))) {
        Logger.error(`⛈️ mutatePage mutation has been called by non admin user`)
        throw new Error(
            `⛈️ mutatePage mutation has been called by non admin user`,
        )
    }

    await Page.deleteOne({ slug })
    Logger.info(`🤟 mutatePage mutation has been finished: ${slug}`)
    return {
        result: true,
    }
}
