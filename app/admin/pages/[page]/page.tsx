import { ServerComponent } from '@app/admin/pages/pages-server'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function Page(props: Props) {
    return <ServerComponent {...props} />
}
