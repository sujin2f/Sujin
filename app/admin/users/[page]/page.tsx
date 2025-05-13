import { UsersServer } from '@app/admin/_components/Users.server'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function Page(props: Props) {
    const params = await props.params
    const page = parseInt(params.page)
    return <UsersServer page={page} />
}
