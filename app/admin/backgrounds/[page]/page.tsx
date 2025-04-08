import { ServerComponent } from '@app/admin/backgrounds/backgrounds-server'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function Page(props: Props) {
    return <ServerComponent {...props} />
}
