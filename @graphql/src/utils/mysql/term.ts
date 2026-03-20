/* Models */
import { select } from '@src/utils/mysql'
import { FetchError } from '@common/model/Error'
/* CONSTANTS */
import { type T_Archive, type T_ImageBlock, type T_MySQLArchive } from '@common/types'
import { WPQuery } from '@src/utils/mysql/wp-query'
/* Utils */
import { getImageBlockFromAttachmentID } from '@src/utils/mysql/media'
/* T_Types */
import type { Nullable } from '@common/types'

const getMeta = async <T = string>(id: number, metaKey: string): Promise<T> => {
    return await select<T>(WPQuery.getTermMeta(id, metaKey)).then((value: T[]) => value[0])
}

/**
 * Get archive image.
 * @param {Term} archive Term.
 * @return {Promise<Nullable<T_ImageBlock>>} Image.
 */
const getThumbnail = async (archive: T_MySQLArchive): Promise<Nullable<T_ImageBlock>> =>
    await getMeta<{ value: string }>(archive.id, 'thumbnail')
        .then(async (data) =>
            data && data.value ? await getImageBlockFromAttachmentID(parseInt(data.value)) : undefined,
        )
        .catch(() => undefined)

/**
 * Get archive by slug.
 *
 * @param {string} slug
 * @return {Promise<T_Archive>}
 * @throws {FetchError} Failed to get the archive.
 */
export const getTermBySlug = async (slug: string): Promise<T_Archive> => {
    const archive = await select<T_MySQLArchive>(WPQuery.getArchiveBy('slug', slug))
        .then((value: T_MySQLArchive[]) => value[0])
        .catch(() => {
            throw new FetchError(`Failed to find MySQL term with: ${slug}`)
        })

    const image = await getThumbnail(archive)

    if (image) {
        return {
            ...archive,
            image,
        }
    }

    return archive
}
