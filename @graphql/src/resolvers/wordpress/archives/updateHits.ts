import sanitize from 'mongo-sanitize'
import Cached from '@sujin/share/model/Cache'
/**
 * Increment the hit counter for a tag archive and flush related caches.
 *
 * This mutation is typically called when a tag archive page is viewed. It
 * increments the `hits` field for the Archive document with the given slug
 * (only when the archive type is `ARCHIVE.TAG`), flushes the tag-cloud cache
 * and logs the event.
 *
 * @param _slug - The slug of the tag whose hit count should be incremented.
 * @returns An empty array (placeholder) once the mutation completes.
 */
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
