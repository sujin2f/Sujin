import sanitize from 'mongo-sanitize'
import { GraphQLError } from 'graphql'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
import { Archive } from '@src/schema/archive'
/* CONSTANTS */
import { ARCHIVE } from '@sujin/lib/constants'
/* T_Types */
import type { T_Archive } from '@sujin/lib/types'

export const category = async (_slug: string): Promise<T_Archive> => {
    const slug = sanitize(_slug)
    /**
     * Load a category archive from MongoDB
     *
     * Throws a GraphQLError with `NO_CONTENT` when the archive is not found.
     */
    const result = await Archive.findOne({
        type: ARCHIVE.CATEGORY,
        slug,
    })
        .then((result) => {
            if (!result) {
                throw new GraphQLError(`Cannot find category ${slug}`, {
                    extensions: {
                        code: 'NO_CONTENT',
                    },
                })
            }
            return result.toObject()
        })
        .catch((e) => {
            Logger.error(`🤬 Failed to find category: ${_slug}, reason ${e}`)
            throw e
        })
    Logger.info(`⭐️ category query done: ${slug}`)
    return result as unknown as T_Archive
}
