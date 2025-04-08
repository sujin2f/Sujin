import { ServerComponent } from '@app/admin/backgrounds/backgrounds-server'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function Page(props: Props) {
    const params = await props.params
    return <ServerComponent {...params} />
}
