import { RecipeServer } from '@app/recipe/_components/recipe.server'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function List(props: Props) {
    // const session = await getServerSession(authOptions)
    const params = await props.params
    const page = parseInt(params.page)

    return <RecipeServer page={page} />
}
