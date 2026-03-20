import sanitize from 'mongo-sanitize'
/* Models */
import { Logger } from '@common/model/Logger'
import { Archive } from '@src/schema/archive'
/* CONSTANTS */
import { ARCHIVE } from '@common/constants'

/**
 * Increment the hit counter for a tag archive.
 *
 * @param slugs - The slug of the tag whose hit count should be incremented.
 * @returns An empty array (placeholder) once the mutation completes.
 */
export const updateHits = async (slugs: string[]) => {
    const promises = slugs
        .filter((slug) => slug)
        .map((slug) => sanitize(slug))
        .map((slug) =>
            Archive.updateOne({ slug, type: ARCHIVE.TAG }, { $inc: { hits: 1 } })
                .then(() => {
                    Logger.info(`⭐️ Update Hits fulfilled! ${slug}`)
                })
                .catch((e) => {
                    Logger.error(`🤬 Update Hits failed! ${slug}, ${JSON.stringify(e)}`)
                }),
        )

    await Promise.allSettled(promises)
}
