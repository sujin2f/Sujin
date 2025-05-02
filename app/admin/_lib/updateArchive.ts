import sanitize from 'mongo-sanitize'
/* Models */
import Cached from '@common/model/Cached'
import { select } from '@common/data/mysql'
import { FetchError } from '@common/model/Error'
/* CONSTANTS */
import {
    ARCHIVE,
    COLLECTION,
    type T_Archive,
    type T_ImageBlock,
    type T_MySQLArchive,
} from '@app/_lib/types'
import { default as schema } from '@app/_lib/schema/10.3.4'
import { MySQLQuery } from '@app/_lib/utils/mysql/constants'
/* Utils */
import { getCacheKey } from '@app/_lib/utils/cache'
import { insertOrReplace } from '@common/data/mongo/mongo'
import { schemaFormatter } from '@common/utils/object'
import { convertImageBlockURL } from '@app/_lib/utils/clients'
import { updateTotal } from '@app/_lib/utils/mongo/updateTotal'
import { getMedia } from '@app/_lib/utils/mysql/getMedia'
/* T_Types */
import type { Nullable } from '@common/types'

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

    const wp = await getMySQLArchiveBySlug(slug)
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

const getMeta = async <T = string>(id: number, metaKey: string): Promise<T> =>
    await select<T>(MySQLQuery.getTermMeta(id, metaKey)).then(
        (value) => value[0],
    )

/**
 * Get archive image.
 * @param {Term} archive Term.
 * @return {Promise<Nullable<T_ImageBlock>>} Image.
 */
const getThumbnail = async (
    archive: T_MySQLArchive,
): Promise<Nullable<T_ImageBlock>> =>
    await getMeta<{ value: string }>(archive.id, 'thumbnail')
        .then(async (data) =>
            data && data.value
                ? await getMedia(parseInt(data.value))
                : undefined,
        )
        .catch(() => undefined)

/**
 * Get archive by slug.
 *
 * @param {string} slug
 * @return {Promise<T_Archive>}
 * @throws {FetchError} Failed to get the archive.
 */
const getMySQLArchiveBySlug = async (slug: string): Promise<T_Archive> => {
    const archive = await select<T_MySQLArchive>(
        MySQLQuery.getArchiveBy('slug', slug),
    )
        .then((value) => value[0])
        .catch(() => {
            throw new FetchError(`Failed to find MySQL term with: ${slug}`)
        })

    const image = await getThumbnail(archive)

    return {
        ...archive,
        image,
    }
}
