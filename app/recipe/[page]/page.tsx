import { unstable_cache } from 'next/cache'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
/* Components */
import { LoadingTable } from '@app/_components/archive/loading-table'
import { ListRecipeServer } from '@app/recipe/[page]/list.server'
/* Utils */
import { getCachedRecipes } from '@app/_lib/data/mongo/recipe'
/* CONSTANTS */
import { HOUR_IN_SECONDS } from '@common/constants/datetime'
import { IS_DEV, VERSION } from '@common/constants/helper'

type Props = {
    params: Promise<{
        page: string
    }>
    userId?: string
}

export default async function ListRecipe({ params, userId }: Props) {
    const { page: pageParam } = await params
    const page = parseInt(pageParam)

    const request = unstable_cache(
        async (page, userId) =>
            await getCachedRecipes(page, userId).catch(() => notFound()),
        [page.toString(), userId ? 'mine' : '', VERSION],
        {
            tags: ['recipe', 'list'],
            revalidate: IS_DEV ? 1 : HOUR_IN_SECONDS,
        },
    )

    return (
        <Suspense fallback={<LoadingTable />}>
            <ListRecipeServer
                page={page}
                request={request(page, userId)}
                mine={!!userId}
            />
        </Suspense>
    )
}
