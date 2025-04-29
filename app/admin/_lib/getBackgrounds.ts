/* CONSTANTS */
import { COLLECTION } from '@app/_lib/types'
/* T_Types */
import type { T_Background } from '@app/_lib/types'
/* Utils */
import { getCollection } from '@common/data/mongo/mongo'
import { getAggregation } from '@app/_lib/utils/server'

export const getBackgrounds = async (
    page: number = 1,
): Promise<T_Background[]> => {
    const collection = await getCollection<T_Background>(COLLECTION.BACKGROUNDS)
    return await collection
        .aggregate<T_Background>([
            ...getAggregation('paging', page),
            ...getAggregation('_id'),
        ])
        .toArray()
}
