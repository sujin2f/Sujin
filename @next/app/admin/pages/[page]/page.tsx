'use server'
import { PagesServer } from '@app/admin/_components/Pages.server'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function Page(props: Props) {
    const params = await props.params
    const page = parseInt(params.page)
    return <PagesServer page={page} />
}
