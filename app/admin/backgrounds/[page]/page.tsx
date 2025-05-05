import { BackgroundsServer } from '@app/admin/_components/Backgrounds.server'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function Page(props: Props) {
    const params = await props.params
    const page = parseInt(params.page)
    return <BackgroundsServer page={page} />
}
