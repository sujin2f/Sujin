import type { ObjectId } from 'mongodb'
/* Models */
import Cached from '@common/model/Cached'
/* Utils */
import { getCacheKey } from '@app/_lib/utils'
import { getCollection, suffix } from '@common/data/mongo/mongo'
import { getAggregation } from '@app/_lib/utils-server'
/* CONSTANTS */
import { IS_DEV } from '@common/constants/helper'
import { PER_PAGE } from '@app/_lib/data/mysql/constants'
import { COLLECTION } from '@app/_lib/types'
import { DAY_IN_SECONDS } from '@common/constants/datetime'
/* T_Types */
import type { SnippetsProp, T_Snippets } from '@app/_lib/types'

export const getCachedAllSnippets = async (
    page: number,
): Promise<SnippetsProp> =>
    await Cached.getInstance().getOrExecute<SnippetsProp>(
        getCacheKey(COLLECTION.SNIPPETS, 'all', page),
        async () => {
            const collection = await getCollection<T_Snippets>(
                COLLECTION.SNIPPETS,
            )
            const total = await collection.countDocuments()
            const snippets = await collection
                .aggregate<T_Snippets>([
                    ...getAggregation('paging', page),
                    {
                        $lookup: {
                            from: `${COLLECTION.SNIPPET}${suffix}`,
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
                    {
                        $project: {
                            user: 0,
                        },
                    },
                ])
                .toArray()
            return {
                snippets,
                pages: Math.ceil(total / PER_PAGE),
            } satisfies SnippetsProp
        },
        DAY_IN_SECONDS,
        IS_DEV,
    )

export const getCachedMySnippets = async (
    userId: ObjectId,
    page: number,
): Promise<SnippetsProp> =>
    await Cached.getInstance().getOrExecute<SnippetsProp>(
        getCacheKey(COLLECTION.SNIPPETS, page),
        async () => {
            const collection = await getCollection<T_Snippets>(
                COLLECTION.SNIPPETS,
            )
            const total = await collection.countDocuments()
            const snippets = await collection
                .aggregate<T_Snippets>([
                    {
                        $match: { user: userId },
                    },
                    ...getAggregation('paging', page),
                    {
                        $lookup: {
                            from: `${COLLECTION.SNIPPET}${suffix}`,
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
                    {
                        $project: {
                            user: 0,
                        },
                    },
                ])
                .toArray()
            return {
                snippets,
                pages: Math.ceil(total / PER_PAGE),
            } satisfies SnippetsProp
        },
        DAY_IN_SECONDS,
        IS_DEV,
    )
