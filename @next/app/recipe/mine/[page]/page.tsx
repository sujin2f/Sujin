/* Components */
import PageRecipe from '@app/recipe/page'
/* CONSTANTS */
/* Utils */

type Props = {
    params: Promise<{
        page: string
    }>
}

export const dynamic = 'force-dynamic'

export default async function RecipeMyListPage(props: Props) {
    const params = await props.params
    const page = parseInt(params.page)

    return <PageRecipe page={page} mine />
}
