import { cachedGQLRequest2 } from '@lib/apollo/queries/GQLRequest'
import { recipes as getRecipes } from '@lib/apollo/queries/recipes/recipes'
import { LoadingTable } from '@lib/components/archive/LoadingTable'
import { Table } from '@lib/components/recipes/Table'
import { COLLECTION } from '@sujin/lib/constants'
import { Suspense } from 'react'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function ListPage(props: Props) {
    const params = await props.params
    const page = parseInt(params.page)
    const promise = cachedGQLRequest2(
        getRecipes,
        '',
        [COLLECTION.RECIPE, 'list', page.toString()],
        page,
    )

    return (
        <article>
            <h2>Recipes as;df nasdfljhb</h2>
            List {page}
            <Suspense fallback={<LoadingTable />}>
                <Table promise={promise} page={page} />
            </Suspense>
        </article>
    )
}
