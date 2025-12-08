'use server'
/* Utils */
import { gqlRequest } from '@app/_lib/redis'
import { recipes as getRecipes } from '@app/recipe/_lib/getRecipes'
/* Components */
import { RecipeTable } from '@app/recipe/_components/RecipeTable'
import { WidgetTitle } from '@app/_components/WidgetTitle'
/* CONSTANTS */
import { COLLECTION } from '@sujin/lib/constants'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function ListPage(props: Props) {
    const params = await props.params
    const page = parseInt(params.page)
    async function action() {
        'use server'
        return await gqlRequest(async () => await getRecipes(page), `${COLLECTION.RECIPE}-list-${page}`)
    }

    return (
        <>
            <WidgetTitle>Recipe List</WidgetTitle>
            <RecipeTable action={action} page={page} />
        </>
    )
}
