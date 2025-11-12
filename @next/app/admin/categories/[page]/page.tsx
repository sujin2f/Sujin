import { CategoriesServer } from '@app/admin/_components/Categories.server'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function Page(props: Props) {
    const params = await props.params
    const page = parseInt(params.page)
    return <CategoriesServer page={page} />
}
