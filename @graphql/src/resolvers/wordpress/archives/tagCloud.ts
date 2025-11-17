/* Models */
import Logger from '@src/utils/logger'
import { Archive } from '@src/schema/archive'
/* Utils */
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'
import { shuffle } from '@sujin/share/utils/array'
/* CONSTANTS */
import { COLLECTION, ARCHIVE } from '@sujin/lib/constants'
import type { T_Archive } from '@sujin/lib/types'

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
                    ...tag,
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
                        ...tag,
                        hits: 0,
                        total: Math.floor(index / step),
                    } satisfies Partial<T_Archive>
                }
            })
        })
    return shuffle(Object.values(tags))
}

export const tagCloud = async (): Promise<Partial<T_Archive>[]> => {
    const request = cachedRequest(
        query,
        getCacheKey(COLLECTION.ARCHIVE, 'tag-cloud'),
    )
    const result = await request()
    Logger.info('🤟 tagCloud query has been finished')
    return result
}
