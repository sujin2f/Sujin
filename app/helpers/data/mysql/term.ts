'use server'
/* Constants */
import { MySQLQuery } from '@app/helpers/constants/mysql-query'
/* Utils */
import { getMedia } from '@app/helpers/data/mysql/media'
/* Models */
import MySQL from '@app/helpers/data/mysql'
import Logger from '@common/model/Logger'
/* Types */
import type {
    ARCHIVE,
    ArchiveType,
    ImageBlockType,
    TermType,
} from '@app/helpers/types/wordpress'
import type { Nullable } from '@common/types'

const getMeta = async <T = string>(id: number, metaKey: string): Promise<T> =>
    await MySQL.getInstance().selectOne<T>(MySQLQuery.getTermMeta(id, metaKey))

export const getTermsByPost = async (id: number): Promise<TermType[]> =>
    await MySQL.getInstance().select<TermType>(MySQLQuery.getTaxonomies(id))

/**
 * Get archive image.
 * @param {Term} archive Term.
 * @return {Promise<Nullable<ImageBlockType>>} Image.
 */
const getThumbnail = async (
    archive: ArchiveType,
): Promise<Nullable<ImageBlockType>> =>
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
 * @param {ARCHIVE} type
 * @return {Promise<ArchiveType>}
 * @throws {Error} Failed to get the archive.
 */
export const getArchiveBySlug = async (
    slug: string,
    type: ARCHIVE,
): Promise<ArchiveType> => {
    Logger.server(
        `Access MySQL for getting archive type: ${type} and slug: ${slug}.`,
    )

    const archive = await MySQL.getInstance()
        .selectOne<ArchiveType>(MySQLQuery.getArchiveBy('slug', slug))
        .catch(() => {
            const message = `Failed to get MySQL archive type: ${type} and slug: ${slug}.`
            Logger.server(message)
            throw new Error(message)
        })

    const image = await getThumbnail(archive)

    return {
        ...archive,
        image,
    }
}
