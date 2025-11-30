/* Models */
import { Logger } from '@sujin/share/model/Logger'
import { Archive } from '@src/schema/archive'
/* Utils */
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'
import { shuffle } from '@sujin/share/utils/array'
/* CONSTANTS */
import { COLLECTION, ARCHIVE } from '@sujin/lib/constants'
import type { T_Archive } from '@sujin/lib/types'

/**
 * Build the tag-cloud payload by combining popularity (total) and recency
 * (hits) rankings into a shuffled array of partial `T_Archive` objects.
 *
 * The query selects the top tags by `total` and by `hits`, merges their
 * rankings into a combined structure, then shuffles the result for front-end
 * consumption.
 */
const query = async (): Promise<Partial<T_Archive>[]> => {
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
    return shuffle(Object.values(tags))
}

/**
 * Return a shuffled tag-cloud payload suitable for the front-end.
 *
 * This function is cached under the key `COLLECTION.ARCHIVE + 'tag-cloud'`.
 */
export const tagCloud = async (): Promise<Partial<T_Archive>[]> => {
    const request = cachedRequest(query, getCacheKey(COLLECTION.ARCHIVE, 'tag-cloud'))
    const result = await request()
    Logger.info('⭐️ tagCloud query has been finished')
    return result
}
