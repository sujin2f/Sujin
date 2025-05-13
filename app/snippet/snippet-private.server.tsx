import { ObjectId } from 'mongodb'
import { unstable_cache } from 'next/cache'
import { Suspense } from 'react'
/* Models */
import Cached from '@common/model/Cached'
import { ForbiddenError } from '@common/model/Error'
/* Utils */
import { getCacheKey } from '@app/_lib/utils/cache'
import { getCollection } from '@common/data/mongo/mongo'
import { getAggregation } from '@app/_lib/utils/server'
import { getCurrentUser } from '@app/api/auth/_lib/utils-server'
/* CONSTANTS */
import { PER_PAGE } from '@app/_lib/constants'
import { COLLECTION } from '@app/_lib/types'
import { DAY_IN_SECONDS, HOUR_IN_SECONDS } from '@common/constants/datetime'
import { IS_DEV, languages, VERSION } from '@common/constants/helper'
/* T_Types */
import type { PropWithPages, T_Snippets } from '@app/_lib/types'
/* Components */
import { Table } from '@app/snippet/snippet-table'
import Input from '@common/components/forms/Input'
import Button from '@common/components/forms/Button'
import Select from '@common/components/forms/Select'

type Props = {
    page: number
}

export async function PrivateServer({ page }: Props) {
    const userId = await getCurrentUser().then((user) => {
        if (!user) {
            throw new ForbiddenError(
                'You need to log in for adding or modifying a recipe.',
            )
        }
        return user._id
    })

    const request = unstable_cache(
        async (page) => await getCachedMySnippets(userId, page),
        [page.toString(), VERSION],
        {
            tags: ['snippet', 'common'],
            revalidate: IS_DEV ? 1 : HOUR_IN_SECONDS,
        },
    )

    const options: Record<string, string> = { '': 'Select Language' }

    languages.forEach((lang) => {
        options[lang] = lang
    })

    return (
        <>
            <h2>Insert Snippet</h2>
            <Input placeholder="Tags" />
            <Select options={options} />
            <Input type="textarea" placeholder="Insert your snippet here" />
            <Button>Submit</Button>

            <h2>My Snippets</h2>
            <Suspense fallback={<div>Loading...</div>}>
                <Table
                    request={request(page)}
                    page={page}
                    userId={userId}
                    columns={['title', 'tags']}
                />
            </Suspense>
        </>
    )
}

const query = async (userId: string, page: number) => {
    const collection = await getCollection<T_Snippets>(COLLECTION.SNIPPETS)
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
}

export const getCachedMySnippets = async (
    userId: string,
    page: number,
): Promise<PropWithPages<T_Snippets>> =>
    await Cached.getInstance().getOrExecute<PropWithPages<T_Snippets>>(
        getCacheKey(COLLECTION.SNIPPETS, page),
        query(userId, page),
        { ttl: DAY_IN_SECONDS, force: IS_DEV },
    )
