'use server'
import sanitize from 'mongo-sanitize'
import { unstable_cache } from 'next/cache'
/* Models */
import { NoContentError } from '@sujin/common/model/Error'
/* CONSTANTS */
import { ARCHIVE, COLLECTION, T_Archive } from '@app/_lib/types'
import { VERSION } from '@sujin/common/constants/helper'
import { revalidate } from '@app/_lib/constants'
/* Utils */
import { findOne } from '@sujin/common/data/mongo/mongo'
import { cachedRequest, getCacheKey } from '@app/_lib/utils/cache'

const query = async (_slug: string, _type: ARCHIVE): Promise<T_Archive> => {
    const slug = sanitize(_slug)
    const type = sanitize(_type)

    return await findOne<T_Archive>(COLLECTION.ARCHIVE, { slug, type }).then(
        (archive) => {
            if (!archive.total) {
                throw new NoContentError(
                    'Archive is empty.',
                    slug,
                    type,
                ).setMetadata(archive)
            }
            return archive
        },
    )
}

/**
 * Get archive by slug
 *
 * @param {string} _slug
 * @param {ARCHIVE} _type
 * @returns {Promise<T_Archive>}
 */
export const cached = async (
    slug: string,
    type: ARCHIVE,
): Promise<T_Archive> => {
    const request = cachedRequest(
        query,
        getCacheKey(COLLECTION.ARCHIVE, type, slug),
    )
    return await request(slug, type)
}

export const getCachedArchive = async (
    slug: string,
    type: ARCHIVE,
): Promise<T_Archive> => {
    const request = unstable_cache(cached, [type, slug, VERSION], {
        tags: ['wordpress', 'archive'],
        revalidate,
    })
    return await request(slug, type)
}
