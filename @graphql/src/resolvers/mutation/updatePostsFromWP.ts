import sanitize from 'mongo-sanitize'
/* Models */
import Logger from '@src/utils/logger'
import { mysqlDisconnect } from '@src/utils/mysql'
import Cached from '@sujin/node-cache'
/* CONSTANTS */
import { ARCHIVE } from '@sujin/lib/constants'
import { COLLECTION, POST_TYPE } from '@sujin/lib/types'
/* Utils */
import { getCacheKey } from '@sujin/lib/utils/cache'
import { verifyAdmin } from '@src/utils/mongo/verifyUser'
import { updateTotal } from '@src/utils/mongo/updateTotal'
/* T_Types */
import type { MutationResultType } from '@src/types'
import type { Context } from '@src/types'
import { getPostsBy } from '@src/utils/mysql/post'
import { updatePost } from '@src/utils/mongo/updatePost'
import mongoose from 'mongoose'

type Param = {
    slug: string
    page: number
}

/**
 * Updates an archive from MySQL and clears associated cache.
 *
 * @param {string} slug - The ID of the term.
 * @param {ARCHIVE} type
 * @returns {Promise<MutationResultType>} An object indicating the result of the operation.
 */
export const updatePostsFromWP = async (
    _: unknown,
    { slug: _slug, page: _page }: Param,
    context: Context,
): Promise<MutationResultType> => {
    if (!(await verifyAdmin(context.token))) {
        Logger.error(
            `⛈️ updatePostsFromWP mutation has been called by non admin user`,
        )
        throw new Error(
            `⛈️ updatePostsFromWP mutation has been called by non admin user`,
        )
    }

    const slug = sanitize(_slug)
    const page = sanitize(_page)

    Cached.getInstance().flush(getCacheKey(COLLECTION.POST))
    Cached.getInstance().flush(
        getCacheKey(COLLECTION.ARCHIVE, 'category', slug),
    )

    await getPostsBy(ARCHIVE.CATEGORY, POST_TYPE.POST, slug, page, true).then(
        async (result) => {
            const archives: mongoose.Types.ObjectId[] = []
            for (const item of result) {
                archives.push(...(await updatePost(item)))
            }
            await updateTotal(archives)
        },
    )
    await mysqlDisconnect()
    Logger.info(
        `🤟 updatePostsFromWP mutation has been finished: ${slug}, ${page}`,
    )
    return {
        result: true,
    }
}
