'use server'
/* CONSTANTS */
import { MySQLQuery } from '@app/_lib/data/mysql/constants'
/* Utils */
import { getMedia } from '@app/_lib/data/mysql/media'
/* Models */
import MySQL from '@app/_lib/data/mysql'
import { FetchError } from '@common/model/Error'
/* T_Types */
import type { T_ImageBlock, T_Archive, T_MySQLArchive } from '@app/_lib/types'
import type { Nullable } from '@common/types'

const getMeta = async <T = string>(id: number, metaKey: string): Promise<T> =>
    await MySQL.getInstance().selectOne<T>(MySQLQuery.getTermMeta(id, metaKey))

export const getTermsByPost = async (id: number): Promise<T_Archive[]> =>
    await MySQL.getInstance().select<T_Archive>(MySQLQuery.getTaxonomies(id))

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
export const getArchiveBySlug = async (slug: string): Promise<T_Archive> => {
    const archive = await MySQL.getInstance()
        .selectOne<T_MySQLArchive>(MySQLQuery.getArchiveBy('slug', slug))
        .catch(() => {
            throw new FetchError(`Failed to find MySQL term with: ${slug}`)
        })

    const image = await getThumbnail(archive)

    return {
        ...archive,
        image,
    }
}
