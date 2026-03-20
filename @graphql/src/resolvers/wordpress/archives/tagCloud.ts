/* Models */
import { Logger } from '@common/model/Logger'
import { Archive } from '@src/schema/archive'
/* Utils */
import { shuffle } from '@common/utils/array'
import { setCache } from '@src/utils/redis/cache'
/* CONSTANTS */
import { ARCHIVE, COLLECTION } from '@common/constants'
import { DAY_IN_SECONDS } from '@common/constants/datetime'
/* T_Types */
import type { T_Archive } from '@common/types'

/**
 * Build the tag-cloud payload by combining popularity (total) and recency
 * (hits) rankings into a shuffled array of partial `T_Archive` objects.
 *
 * The query selects the top tags by `total` and by `hits`, merges their
 * rankings into a combined structure, then shuffles the result for front-end
 * consumption.
 */
export const tagCloud = async (): Promise<Partial<T_Archive>[]> => {
    const tags: Record<string, Partial<T_Archive>> = {}

    await Archive.find<T_Archive>({
        total: { $not: { $eq: 0 } },
        type: ARCHIVE.TAG,
    })
        .sort({ total: -1 })
        .limit(20)
        .then((result) => {
            const step = result.length / 5
            result.forEach((tag, index) => {
                tags[tag.slug] = {
                    slug: tag.slug,
                    title: tag.title,
                    total: 0,
                    hits: Math.floor(index / step),
                } satisfies Partial<T_Archive>
            })
        })

    await Archive.find<T_Archive>({
        total: { $not: { $eq: 0 } },
        type: ARCHIVE.TAG,
    })
        .sort({ hits: -1 })
        .limit(20)
        .then((result) => {
            const step = result.length / 5
            result.forEach((tag, index) => {
                if (tags[tag.slug]) {
                    tags[tag.slug] = {
                        ...tags[tag.slug],
                        total: Math.floor(index / step),
                    }
                } else {
                    tags[tag.slug] = {
                        slug: tag.slug,
                        title: tag.title,
                        hits: 0,
                        total: Math.floor(index / step),
                    } satisfies Partial<T_Archive>
                }
            })
        })
    const result = shuffle(Object.values(tags))
    setCache(JSON.stringify(result), `${COLLECTION.ARCHIVE}-tagCloud`, DAY_IN_SECONDS)
    Logger.info('⭐️ tagCloud query has been finished')
    return result
}
