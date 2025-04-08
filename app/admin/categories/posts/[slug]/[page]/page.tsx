import { ServerComponent } from '@app/admin/categories/posts/category-post-server'

type Props = {
    params: Promise<{
        page: string
        slug: string
    }>
}

export default async function Page(props: Props) {
    const params = await props.params
    return <ServerComponent {...params} />
}
