import { ObjectId } from 'mongodb'
/* Models */
import { UnauthorizedError } from '@common/model/Error'
/* Utils */
import { isAdmin } from '@app/_lib/data/mongo/user'
import { getCollection } from '@common/data/mongo/mongo'
import { getAggregation } from '@app/_lib/utils/server'
/* CONSTANTS */
import { ERROR_MESSAGE } from '@app/_lib/constants-error'
import { COLLECTION, type T_Post, type T_ArchivePost } from '@app/_lib/types'
/* T_Types */
import type { T_Mongo } from '@common/types/mongo'

export const getArchivePosts = async (_id: ObjectId, page: number) => {
    if (!(await isAdmin()))
        throw new UnauthorizedError(
            ERROR_MESSAGE.UNAUTHORIZED,
            'getArchivePosts()',
        )

    const collection = await getCollection<T_Mongo<T_Post>>(COLLECTION.POST)
    return await collection
        .aggregate<T_ArchivePost>([
            {
                $match: {
                    archives: new ObjectId(_id),
                },
            },
            {
                $sort: { date: -1 },
            },
            ...getAggregation('paging', page),
            ...getAggregation('_id'),
            ...getAggregation('to-archive-post'),
            {
                $project: {
                    archives: 0,
                },
            },
        ])
        .toArray()
}
