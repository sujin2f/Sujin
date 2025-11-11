'use server'
/* Utils */
import { cachedRequest, getCacheKey } from '@app/_lib/utils/cache'
import { shuffle } from '@sujin/common/utils/array'
import { getCollection } from '@sujin/common/data/mongo/mongo'
/* CONSTANTS */
import { ARCHIVE, COLLECTION, type T_Archive } from '@app/_lib/types'

const query = async (): Promise<T_Archive[]> => {
    const tags: Record<string, T_Archive> = {}
    const collection = await getCollection<T_Archive>(COLLECTION.ARCHIVE)

    await collection
        .find({
            total: { $not: { $eq: 0 } },
            type: ARCHIVE.TAG,
        })
        .sort({ total: -1 })
        .limit(20)
        .toArray()
        .then((result) => {
            const step = result.length / 5
            result.forEach((tag, index) => {
                tags[tag.slug] = {
                    ...tag,
                    hits: Math.floor(index / step),
                }
            })
        })

    await collection
        .find({
            total: { $not: { $eq: 0 } },
            type: ARCHIVE.TAG,
        })
        .sort({ hits: -1 })
        .limit(20)
        .toArray()
        .then((result) => {
            const step = result.length / 5
            result.forEach((tag, index) => {
                if (tags[tag.slug]) {
                    tags[tag.slug] = {
                        ...tag,
                        total: Math.floor(index / step),
                        hits: tags[tag.slug].hits,
                    }
                } else {
                    tags[tag.slug] = {
                        ...tag,
                        total: Math.floor(index / step),
                    }
                }
            })
        })

    return shuffle(Object.values(tags))
}

export const getTagCloud = async (): Promise<T_Archive[]> => {
    const request = cachedRequest(
        query,
        getCacheKey(COLLECTION.ARCHIVE, 'tag-cloud'),
    )
    return await request()
}
