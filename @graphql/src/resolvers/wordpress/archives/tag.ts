import sanitize from 'mongo-sanitize'
import { GraphQLError } from 'graphql'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
import { Archive } from '@src/schema/archive'
/* CONSTANTS */
import { ARCHIVE } from '@sujin/lib/constants'
/* T_Types */
import type { T_Archive } from '@sujin/lib/types'

export const tag = async (_slug: string): Promise<T_Archive> => {
    const slug = sanitize(_slug)
    /**
     * Load a tag archive from MongoDB
     *
     * Throws a GraphQLError with `NO_CONTENT` when the archive is not found.
     */
    const result = await Archive.findOne<T_Archive>({
        type: ARCHIVE.TAG,
        slug,
    }).then((result) => {
        if (!result) {
            throw new GraphQLError(`Cannot find tag ${slug}`, {
                extensions: {
                    code: 'NO_CONTENT',
                },
            })
        }
        return result
    })
    Logger.info(`🤞 tag query done: ${slug}`)
    return result
}
