import sanitize from 'mongo-sanitize'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
import { Archive } from '@src/schema/archive'
/* CONSTANTS */
import { ARCHIVE } from '@sujin/lib/constants'

/**
 * Increment the hit counter for a tag archive.
 *
 * This mutation is typically called when a tag archive page is viewed. It
 * increments the `hits` field for the Archive document with the given slug
 * (only when the archive type is `ARCHIVE.TAG`).
 *
 * @param _slug - The slug of the tag whose hit count should be incremented.
 * @returns An empty array (placeholder) once the mutation completes.
 */
export const updateHits = async (_slug: string) => {
    const slug = sanitize(_slug)
    await Archive.updateOne({ slug, type: ARCHIVE.TAG }, { $inc: { hits: 1 } })

    Logger.info(`🤞 updateHits mutation has been finished: ${_slug}`)
    return []
}
