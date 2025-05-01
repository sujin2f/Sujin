import { Suspense } from 'react'
import { unstable_cache } from 'next/cache'

import { getCachedAllSnippets } from '@app/_lib/data/mongo/snippet'
import { HOUR_IN_SECONDS } from '@common/constants/datetime'
import { IS_DEV, VERSION } from '@common/constants/helper'
import { Table } from '@app/snippet/snippet-table'
import { getCurrentUser } from '@app/api/auth/_lib/utils-server'

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

    const userId = await getCurrentUser()
        .then((user) => user._id)
        .catch(() => undefined)

    const columns = userId ? ['title', 'tags', 'import'] : ['title', 'tags']

    return (
        <>
            <h2>Public Snippets</h2>
            <Suspense fallback={<div>Loading...</div>}>
                <Table
                    request={request(page)}
                    page={page}
                    userId={userId}
                    columns={columns}
                />
            </Suspense>
        </>
    )
}
