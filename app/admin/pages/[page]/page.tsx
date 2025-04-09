import { ServerComponent } from '@app/admin/pages/pages-server'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function Page(props: Props) {
    const params = await props.params
    return <ServerComponent {...params} />
}
