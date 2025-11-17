import sanitize from 'mongo-sanitize'
import { GraphQLError } from 'graphql'
/* Models */
import Logger from '@src/utils/logger'
import { Archive } from '@src/schema/archive'
/* Utils */
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'
/* CONSTANTS */
import { COLLECTION, ARCHIVE } from '@sujin/lib/constants'
/* T_Types */
import type { T_Archive } from '@sujin/lib/types'

export const category = async (_slug: string): Promise<T_Archive> => {
    const slug = sanitize(_slug)

    const request = cachedRequest(async (slug: string): Promise<T_Archive> => {
        return await Archive.findOne<T_Archive>({
            type: ARCHIVE.CATEGORY,
            slug,
        }).then((result) => {
            if (!result) {
                throw new GraphQLError(`Cannot find category ${slug}`, {
                    extensions: {
                        code: 'NO_CONTENT',
                    },
                })
            }
            return result
        })
    }, getCacheKey(COLLECTION.ARCHIVE, slug))

    const result = await request(slug)
    Logger.info(`🤟 category query done: ${slug}`)
    return result
}
