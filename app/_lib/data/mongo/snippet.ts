import { ObjectId } from 'mongodb'
/* Models */
import Cached from '@common/model/Cached'
/* Utils */
import { getCacheKey } from '@app/_lib/utils/cache'
import { getCollection } from '@common/data/mongo/mongo'
import { getAggregation } from '@app/_lib/utils/server'
/* CONSTANTS */
import { IS_DEV } from '@common/constants/helper'
import { PER_PAGE } from '@app/_lib/data/mysql/constants'
import { COLLECTION } from '@app/_lib/types'
import { DAY_IN_SECONDS } from '@common/constants/datetime'
/* T_Types */
import type { PropWithPages, T_Snippets } from '@app/_lib/types'

export const getCachedAllSnippets = async (
    page: number,
): Promise<PropWithPages<T_Snippets>> =>
    await Cached.getInstance().getOrExecute<PropWithPages<T_Snippets>>(
        getCacheKey(COLLECTION.SNIPPETS, 'all', page),
        async () => {
            const collection = await getCollection<T_Snippets>(
                COLLECTION.SNIPPETS,
            )
            const total = await collection.countDocuments()
            const list = await collection
                .aggregate<T_Snippets>([
                    ...getAggregation('_id'),
                    ...getAggregation('_id', 'user'),
                    ...getAggregation('paging', page),
                    {
                        $lookup: {
                            from: COLLECTION.SNIPPET,
                            localField: 'snippets',
                            foreignField: '_id',
                            as: 'snippets',
                            pipeline: [
                                {
                                    $addFields: {
                                        _id: { $toString: '$_id' },
                                    },
                                },
                            ],
                        },
                    },
                ])
                .toArray()
            return {
                list,
                pages: Math.ceil(total / PER_PAGE),
            } satisfies PropWithPages<T_Snippets>
        },
        DAY_IN_SECONDS,
        IS_DEV,
    )

export const getCachedMySnippets = async (
    userId: string,
    page: number,
): Promise<PropWithPages<T_Snippets>> =>
    await Cached.getInstance().getOrExecute<PropWithPages<T_Snippets>>(
        getCacheKey(COLLECTION.SNIPPETS, page),
        async () => {
            const collection = await getCollection<T_Snippets>(
                COLLECTION.SNIPPETS,
            )
            const total = await collection.countDocuments()
            const list = await collection
                .aggregate<T_Snippets>([
                    {
                        $match: { user: new ObjectId(userId) },
                    },
                    ...getAggregation('paging', page),
                    ...getAggregation('_id'),
                    ...getAggregation('_id', 'user'),
                    {
                        $lookup: {
                            from: COLLECTION.SNIPPET,
                            localField: 'snippets',
                            foreignField: '_id',
                            as: 'snippets',
                            pipeline: [
                                {
                                    $addFields: {
                                        _id: { $toString: '$_id' },
                                    },
                                },
                            ],
                        },
                    },
                ])
                .toArray()
            return {
                list,
                pages: Math.ceil(total / PER_PAGE),
            } satisfies PropWithPages<T_Snippets>
        },
        DAY_IN_SECONDS,
        IS_DEV,
    )
