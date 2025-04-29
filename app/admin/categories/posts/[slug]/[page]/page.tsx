import { PostsServer } from '@app/admin/_components/Posts-server'

type Props = {
    params: Promise<{
        page: string
        slug: string
    }>
}

export default async function Page(props: Props) {
    const params = await props.params
    const page = parseInt(params.page)
    return <PostsServer page={page} slug={params.slug} />
}
