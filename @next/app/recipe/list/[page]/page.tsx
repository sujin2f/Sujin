'use server'
/* Components */
import PageRecipe from '@app/recipe/page'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function ListPage(props: Props) {
    const params = await props.params
    const page = parseInt(params.page)

    return <PageRecipe page={page} />
}
