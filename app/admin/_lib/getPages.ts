/* CONSTANTS */
import { COLLECTION, type T_Page } from '@app/_lib/types'
/* Utils */
import { getCollection } from '@common/data/mongo/mongo'
import { getAggregation } from '@app/_lib/utils/server'

/**
 * Admin get Pages by pagination
 *
 * @param {number} page - Page
 * @returns {Promise<T_Page[]>}
 */
export const getPages = async (page: number = 1): Promise<T_Page[]> => {
    const collection = await getCollection<T_Page>(COLLECTION.PAGE)
    return await collection
        .aggregate<T_Page>([
            {
                $sort: { date: -1 },
            },
            ...getAggregation('paging', page),
            ...getAggregation('_id'),
        ])
        .toArray()
}
