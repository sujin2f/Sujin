import { PrivateServer } from '@app/snippet/snippet-private.server'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function SnippetPrivate(props: Props) {
    const params = await props.params
    const page = parseInt(params.page)

    return <PrivateServer page={page} />
}
