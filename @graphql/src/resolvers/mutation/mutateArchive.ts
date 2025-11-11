import sanitize from 'mongo-sanitize'
/* Mongoose */
import { Archive } from '@src/schema/archive'
/* Models */
import Cached from '@sujin/node-cache'
/* CONSTANTS */
import { ARCHIVE, COLLECTION } from '@sujin/lib/types'
/* Utils */
import { getCacheKey } from '@sujin/lib/utils/cache'
import { convertWPImageURL } from '@src/utils/mongo/convertWPImageURL'
import { getTermBySlug } from '@src/utils/mysql/term'
/* T_Types */
import type { MutationResultType } from '@src/types'
import { updateTotal } from '@src/utils/mongo/updateTotal'

/**
 * Update archive from WP
 *
 * @param {string} slug
 * @param {ARCHIVE} type
 * @returns {Promise<T_Archive>} updated archive
 */
const updateArchive = async (slug: string, type: ARCHIVE): Promise<void> => {
    await Cached.getInstance().flush(
        getCacheKey(COLLECTION.ARCHIVE, type, slug),
    )

    const wp = await getTermBySlug(slug)
    if (wp.image) {
        wp.image = convertWPImageURL(wp.image)
    }

    const archive = await Archive.findOneAndReplace(
        { slug, type },
        { ...wp, type },
    ).then(async (result) => {
        if (!result) {
            return await Archive.insertOne({ ...wp, type })
        }
        return result
    })

    await updateTotal([archive._id])
}

/**
 * Updates an archive from MySQL and clears associated cache.
 *
 * @param {string} slug - The ID of the term.
 * @param {ARCHIVE} type
 * @returns {Promise<MutationResultType>} An object indicating the result of the operation.
 */
export const mutateArchive = async (
    slug: string,
    type: ARCHIVE,
): Promise<MutationResultType> => {
    await updateArchive(sanitize(slug), sanitize(type))
    return {
        result: true,
    }
}
