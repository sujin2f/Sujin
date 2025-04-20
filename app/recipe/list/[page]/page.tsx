import { RecipeListServer } from '@app/recipe/recipe-list.server'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function List(props: Props) {
    // const session = await getServerSession(authOptions)
    const params = await props.params
    const page = parseInt(params.page)

    return <RecipeListServer page={page} />
}
