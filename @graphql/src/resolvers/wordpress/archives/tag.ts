import sanitize from 'mongo-sanitize'
/* Models */
import { Logger } from '@common/model/Logger'
import { Archive } from '@src/schema/archive'
/* CONSTANTS */
import { ARCHIVE, COLLECTION } from '@common/constants'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
/* T_Types */
import type { T_Archive } from '@common/types'
/* Utils */
import { setCache } from '@src/utils/redis/cache'

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
    })
        .then((result) => {
            if (!result) {
                setCache(JSON.stringify({ slug: '' }), `${COLLECTION.ARCHIVE}-${ARCHIVE.TAG}-${_slug}`, WEEK_IN_SECONDS)
                throw new Error(`🤬 Cannot find tag ${slug}`)
            }
            return result
        })
        .catch((e) => {
            Logger.error(e.message)
            throw e
        })

    setCache(JSON.stringify(result), `${COLLECTION.ARCHIVE}-${ARCHIVE.TAG}-${_slug}`, WEEK_IN_SECONDS)
    Logger.info(`🤞 tag query done: ${slug}`)
    return result
}
