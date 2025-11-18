import sanitize from 'mongo-sanitize'
import Cached from '@sujin/node-cache'
/* Models */
import Logger from '@src/utils/logger'
import { Archive } from '@src/schema/archive'
/* CONSTANTS */
import { ARCHIVE, COLLECTION } from '@sujin/lib/constants'
/* Utils */
import { getCacheKey } from '@sujin/lib/utils/cache'

export const updateHits = async (_slug: string) => {
    const slug = sanitize(_slug)
    await Archive.updateOne({ slug, type: ARCHIVE.TAG }, { $inc: { hits: 1 } })

    await Cached.getInstance().flush(
        getCacheKey(COLLECTION.ARCHIVE, 'tag-cloud'),
    )
    Logger.info(`🤟 updateHits mutation has been finished: ${_slug}`)
    return []
}
