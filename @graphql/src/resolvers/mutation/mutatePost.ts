import sanitize from 'mongo-sanitize'
/* Models */
import Logger from '@src/utils/logger'
import Cached from '@sujin/node-cache'
/* T_Types */
import type { MutationResultType } from '@src/types'
import type { Context } from '@src/types'
/* Utils */
import { mysqlDisconnect } from '@src/utils/mysql'
import { getPostBy } from '@src/utils/mysql/post'
import { getCacheKey } from '@sujin/lib/utils/cache'
import { verifyAdmin } from '@src/utils/mongo/verifyUser'
import { updatePost } from '@src/utils/mongo/updatePost'
import { updateTotal } from '@src/utils/mongo/updateTotal'
/* CONSTANTS */
import { COLLECTION, POST_TYPE } from '@sujin/lib/constants'

type Param = {
    nonce: string
    slug: string
}

export const mutatePost = async (
    _: unknown,
    { slug: _slug }: Param,
    context: Context,
): Promise<MutationResultType> => {
    if (!(await verifyAdmin(context.token))) {
        Logger.error(`⛈️ mutatePost mutation has been called by non admin user`)
        throw new Error(
            `⛈️ mutatePost mutation has been called by non admin user`,
        )
    }

    const slug = sanitize(_slug)

    Cached.getInstance().flush(getCacheKey(COLLECTION.POST, slug))
    await getPostBy('slug', slug, POST_TYPE.POST, true).then(async (post) => {
        const archives = await updatePost(post)
        await updateTotal(archives)
    })
    await mysqlDisconnect()

    Logger.info(`🤟 mutatePost mutation has been finished: ${_slug}`)
    return {
        result: true,
    }
}
