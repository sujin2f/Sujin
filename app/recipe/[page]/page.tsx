/* Components */
import { ListServer } from '@app/recipe/_components/List.server'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function ListPage(props: Props) {
    const params = await props.params
    const page = parseInt(params.page)

    return <ListServer page={page} />
}
