import { unstable_cache } from 'next/cache'
/* CONSTANTS */
import { VERSION } from '@common/constants/helper'
import { COLLECTION } from '@app/_lib/types'
import { revalidate } from '@app/_lib/constants'
/* Utils */
import { cachedRequest, getCacheKey } from '@app/_lib/utils/cache'
import { getCollection } from '@common/data/mongo/mongo'
/* T_Types */
import type { T_Background } from '@app/_lib/types'

export const getBackgrounds = async () => {
    const request = unstable_cache(cached, ['backgrounds', VERSION], {
        tags: ['wordpress', 'backgrounds'],
        revalidate,
    })
    return await request()
}

/**
 * Get backgrounds
 * This returns the cached result if it exists
 *
 * @returns {Promise<T_Background[]>} - The background array
 */
const cached = async (): Promise<T_Background[]> => {
    const request = cachedRequest(query, getCacheKey(COLLECTION.BACKGROUNDS))
    return await request()
}

const query = async (): Promise<T_Background[]> => {
    const collection = await getCollection<T_Background>(COLLECTION.BACKGROUNDS)
    return await collection
        .aggregate<T_Background>([{ $sample: { size: 10 } }])
        .toArray()
}
