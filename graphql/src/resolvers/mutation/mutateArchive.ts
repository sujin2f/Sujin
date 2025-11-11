import sanitize from 'mongo-sanitize'
/* Mongoose */
import { Archive } from '@src/schema/archive'
/* Models */
import Cached from '@common/model/Cached'
/* CONSTANTS */
import { ARCHIVE, COLLECTION } from '@lib/types'
/* Utils */
import { getCacheKey } from '@lib/utils/cache'
import { convertImageBlockURL } from '@src/utils/mongo/convertImageBlockURL'
import { getArchiveBySlug } from '@src/utils/mysql/getArchiveBySlug'
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
const updateArchive = async (_slug: string, _type: ARCHIVE): Promise<void> => {
    const slug = sanitize(_slug)
    const type = sanitize(_type)

    await Cached.getInstance().flush(
        getCacheKey(COLLECTION.ARCHIVE, type, slug),
    )

    const wp = await getArchiveBySlug(slug)
    if (wp.image) {
        wp.image = convertImageBlockURL(wp.image)
    }

    const archive = await Archive.findOne({ slug, type }).then(
        async (result) => {
            if (!result) {
                return await Archive.insertOne({ ...wp, type })
            }

            return result
        },
    )

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
    await updateArchive(slug, type)
    return {
        result: true,
    }
}
