import { Suspense } from 'react'
import { unstable_cache } from 'next/cache'
/* Models */
import Cached from '@sujin/common/model/Cached'
/* CONSTANTS */
import { HOUR_IN_SECONDS } from '@sujin/common/constants/datetime'
import { IS_DEV, VERSION } from '@sujin/common/constants/helper'
import { PER_PAGE } from '@app/_lib/constants'
import { COLLECTION } from '@app/_lib/types'
import { DAY_IN_SECONDS } from '@sujin/common/constants/datetime'
/* Components */
import { Table } from '@app/snippet/snippet-table'
/* Utils */
import { getCurrentUser } from '@app/api/auth/_lib/utils-server'
import { getCacheKey } from '@app/_lib/utils/cache'
import { getCollection } from '@sujin/common/data/mongo/mongo'
import { getAggregation } from '@app/_lib/utils/server'
/* T_Types */
import type { PropWithPages, T_Snippets } from '@app/_lib/types'

type Props = {
    page: number
}

export async function PublicServer({ page }: Props) {
    const request = unstable_cache(
        async (page) => await getCachedAllSnippets(page),
        [page.toString(), VERSION],
        {
            tags: ['snippet', 'common'],
            revalidate: IS_DEV ? 1 : HOUR_IN_SECONDS,
        },
    )

    const user = await getCurrentUser()

    const columns = user?._id ? ['title', 'tags', 'import'] : ['title', 'tags']

    return (
        <>
            <h2>Public Snippets</h2>
            <Suspense fallback={<div>Loading...</div>}>
                <Table
                    request={request(page)}
                    page={page}
                    userId={user?._id}
                    columns={columns}
                />
            </Suspense>
        </>
    )
}

const getCachedAllSnippets = async (
    page: number,
): Promise<PropWithPages<T_Snippets>> =>
    (await Cached.getInstance().getOrExecute<PropWithPages<T_Snippets>>(
        getCacheKey(COLLECTION.SNIPPETS, 'all', page),
        (async () => {
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
        })(),
        { ttl: DAY_IN_SECONDS, force: IS_DEV },
    )) as PropWithPages<T_Snippets>
