import { unstable_cache } from 'next/cache'
import { getCachedAllSnippets } from '@app/_lib/data/mongo/snippet'
import { HOUR_IN_SECONDS } from '@common/constants/datetime'
import { IS_DEV, VERSION } from '@common/constants/helper'
import { Table } from '@app/snippet/snippet-table'
import { getServerSession } from 'next-auth'
import { authOptions } from '@app/api/auth/constants'
import { Suspense } from 'react'
import { getUser } from '@app/_lib/data/mongo/user'

type Props = {
    page: number
}

export async function PublicServer({ page }: Props) {
    const session = await getServerSession(authOptions)
    const request = unstable_cache(
        async (page) => await getCachedAllSnippets(page),
        [page.toString(), VERSION],
        {
            tags: ['snippet', 'common'],
            revalidate: IS_DEV ? 1 : HOUR_IN_SECONDS,
        },
    )

    let userId: string | undefined = undefined
    if (session?.user?.email) {
        userId = await getUser(session?.user?.email).then((user) => {
            if (!user) return undefined
            return user._id.toString()
        })
    }

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
