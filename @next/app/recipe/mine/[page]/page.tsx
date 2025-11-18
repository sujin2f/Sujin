import { cachedGQLRequest2 } from '@lib/apollo/queries/GQLRequest'
import { recipes as getRecipes } from '@lib/apollo/queries/recipes/recipes'
import { LoadingTable } from '@lib/components/archive/LoadingTable'
import { Table } from '@lib/components/recipes/Table'
import { COLLECTION } from '@sujin/lib/constants'
import { T_Session } from '@sujin/lib/types'
import { getSession, getAccessToken } from '@lib/utils/session'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function RecipeMyListPage(props: Props) {
    const params = await props.params
    const page = parseInt(params.page)

    const session = await getSession()
    const userId = session && (session.user as T_Session)._id
    const token = await getAccessToken()

    if (!userId) {
        notFound()
    }

    const promise = cachedGQLRequest2(
        getRecipes,
        token,
        [COLLECTION.RECIPE, 'my-list', userId, page.toString()],
        page,
        true,
    )

    return (
        <article>
            <h2>My Recipes</h2>
            <Suspense fallback={<LoadingTable />}>
                <Table promise={promise} page={page} />
            </Suspense>
        </article>
    )
}
