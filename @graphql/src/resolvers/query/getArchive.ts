import sanitize from 'mongo-sanitize'
/* Mongoose */
import { Archive } from '@src/schema/archive'
/* Module */
import { DatabaseError } from '@sujin/share/model/Error'
/* CONSTANTS */
import { COLLECTION } from '@sujin/lib/types'
/* Utils */
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'
/* T_Types */
import type { T_Archive } from '@sujin/lib/types'

type Param = {
    slug: string
    type: 'category' | 'tag'
}

/**
 * Get archive
 * This returns the cached result if it exists
 *
 * @returns {Promise<T_Archive>} - The background array
 */
export const getArchive = async (
    _: unknown,
    { slug: _slug, type: _type }: Param,
): Promise<T_Archive> => {
    const slug = sanitize(_slug)
    const type = sanitize(_type)
    const request = cachedRequest(
        query,
        getCacheKey(COLLECTION.ARCHIVE, slug, type),
    )

    const result = await request(slug, type)
    if (!result) {
        throw new DatabaseError('Archive does not exist')
    }
    return result
}

const query = async (slug: string, type: string): Promise<T_Archive | null> => {
    return await Archive.findOne({ slug, type }).then((result) => {
        if (!result) {
            return null
        }
        return result.toObject() as T_Archive
    })
}
