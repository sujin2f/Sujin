import Categories from '@app/admin/categories/[page]/Categories'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function Page(props: Props) {
    return <Categories {...props} />
}
