/* Components */
import { ListServer } from '@app/recipe/_components/List.server'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function ListMinePage(props: Props) {
    const params = await props.params
    const page = parseInt(params.page)

    return <ListServer mine page={page} title="My Recipes" />
}
