import { TagsServer } from '@app/admin/_components/Tags.server'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function Page(props: Props) {
    const params = await props.params
    const page = parseInt(params.page)
    return <TagsServer page={page} />
}
