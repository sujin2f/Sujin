/* Components */
import { RecipeList } from '@app/recipe/_components/RecipeList'

type Props = {
    params: Promise<{
        page: string
    }>
}

export const dynamic = 'force-dynamic'

export default async function ListPage(props: Props) {
    const params = await props.params
    const page = parseInt(params.page)

    return <RecipeList page={page} />
}
