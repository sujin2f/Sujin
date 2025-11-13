import { Document } from 'mongoose'
import { GraphQLError } from 'graphql'
import sanitize from 'mongo-sanitize'

/* Models */
import { Archive } from '@src/schema/archive'
import Logger from '@src/utils/logger'
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
    Logger.info(`🤟 archive query has been requested: ${_slug}, ${_type}`)
    const slug = sanitize(_slug)
    const type = sanitize(_type)
    const request = cachedRequest(
        query,
        getCacheKey(COLLECTION.ARCHIVE, slug, type),
    )
    const result = await request(slug, type)
    Logger.info('🤟 archive query has been finished')
    return result
}

const query = async (slug: string, type: string): Promise<T_Archive> => {
    return await Archive.findOne<Document<string, unknown, T_Archive>>({
        slug,
        type,
    }).then((result) => {
        if (!result) {
            throw new GraphQLError(`Cannot find archive ${slug} ${type}`, {
                extensions: {
                    code: 'NO_CONTENT',
                },
            })
        }
        return result.toObject()
    })
}
