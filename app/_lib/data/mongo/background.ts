import type { WithoutId } from 'mongodb'
/* CONSTANTS */
import { COLLECTION } from '@app/_lib/types'
/* T_Types */
import type { T_Background } from '@app/_lib/types'
/* Utils */
import { cachedRequest } from '@app/_lib/utils/cache'
import { getCollection } from '@common/data/mongo/mongo'

/**
 * Get backgrounds
 * This returns the cached result if it exists
 *
 * @returns {Promise<WithoutId<T_Background>[]>} - The background array
 */
export const getCachedBackgrounds = async (): Promise<
    WithoutId<T_Background>[]
> =>
    await cachedRequest(COLLECTION.BACKGROUNDS, [], async () => {
        const collection = await getCollection<T_Background>(
            COLLECTION.BACKGROUNDS,
        )
        return await collection
            .aggregate<T_Background>([{ $sample: { size: 10 } }])
            .project<WithoutId<T_Background>>({ _id: 0 })
            .toArray()
    })
