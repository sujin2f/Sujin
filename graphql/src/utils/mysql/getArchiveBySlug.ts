/* Models */
import { select } from '@sujin/common/data/mysql'
import { FetchError } from '@sujin/common/model/Error'
/* CONSTANTS */
import {
    type T_Archive,
    type T_ImageBlock,
    type T_MySQLArchive,
} from '@sujin/lib/types'
import { MySQLQuery } from '@src/utils/mysql/constants'
/* Utils */
import { getMedia } from '@src/utils/mysql/getMedia'
/* T_Types */
import type { Nullable } from '@sujin/common/types'

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
export const getArchiveBySlug = async (slug: string): Promise<T_Archive> => {
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
