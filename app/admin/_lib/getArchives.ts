import sanitize from 'mongo-sanitize'
/* CONSTANTS */
import { ARCHIVE, COLLECTION, type T_Archive } from '@app/_lib/types'
/* Utils */
import { getCollection } from '@sujin/common/data/mongo/mongo'
import { getAggregation } from '@app/_lib/utils/server'

export const getArchives = async (
    _type: ARCHIVE,
    page: number = 1,
): Promise<T_Archive[]> => {
    const type = sanitize(_type)

    const collection = await getCollection<T_Archive>(COLLECTION.ARCHIVE)
    return await collection
        .aggregate<T_Archive>([
            {
                $match: { type },
            },
            ...getAggregation('paging', page),
            ...getAggregation('_id'),
        ])
        .toArray()
}
