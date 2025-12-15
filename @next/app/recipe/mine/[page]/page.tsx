'use server'
/* Components */
import PageRecipe from '@app/recipe/page'
/* CONSTANTS */
/* Utils */

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function RecipeMyListPage(props: Props) {
    const params = await props.params
    const page = parseInt(params.page)

    return <PageRecipe page={page} mine />
}
