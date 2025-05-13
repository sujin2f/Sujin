import { PublicServer } from '@app/snippet/snippet-public.server'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function SnippetPublic(props: Props) {
    const params = await props.params
    const page = parseInt(params.page)

    return <PublicServer page={page} />
}
