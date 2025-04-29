import sanitize from 'mongo-sanitize'
/* Models */
import Cached from '@common/model/Cached'
/* CONSTANTS */
import { ARCHIVE, COLLECTION, T_Archive } from '@app/_lib/types'
import { default as schema } from '@app/_lib/schema/10.3.4'
/* Utils */
import { getArchiveBySlug as getMySQLArchive } from '@app/_lib/data/mysql/term'
import { getCacheKey } from '@app/_lib/utils/cache'
import { insertOrReplace } from '@common/data/mongo/mongo'
import { schemaFormatter } from '@common/utils/object'
import { convertImageBlockURL } from '@app/_lib/data/mysql/utils'
import { updateTotal } from '@app/admin/_lib/updateTotal'

export const formatter = (term: Record<string, unknown>): T_Archive => {
    const formatted = schemaFormatter(term, schema.archive) as T_Archive
    return formatted
}

/**
 * Update archive from WP
 *
 * @param {string} slug
 * @param {ARCHIVE} type
 * @returns {Promise<T_Archive>} updated archive
 */
export const updateArchive = async (
    _slug: string,
    _type: ARCHIVE,
): Promise<void> => {
    const slug = sanitize(_slug)
    const type = sanitize(_type)

    await Cached.getInstance().flush(
        getCacheKey(COLLECTION.ARCHIVE, type, slug),
    )

    const wp = await getMySQLArchive(slug)
    if (wp.image) {
        wp.image = convertImageBlockURL(wp.image)
    }

    const result = await insertOrReplace<T_Archive>(
        COLLECTION.ARCHIVE,
        { slug, type },
        formatter({ ...wp, type, total: 0, hits: 0 }),
    )

    await updateTotal([result])
}
