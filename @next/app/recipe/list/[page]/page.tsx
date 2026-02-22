/* Components */
import PageRecipe from '@app/recipe/page'

type Props = {
    params: Promise<{
        page: string
    }>
}

export const dynamic = 'force-dynamic'

export default async function ListPage(props: Props) {
    const params = await props.params
    const page = parseInt(params.page)

    return <PageRecipe page={page} />
}
