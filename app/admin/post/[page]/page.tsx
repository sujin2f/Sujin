import getPosts from '@src/db/mongo/admin/getPosts'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function AdminPost(props: Props) {
    const params = await props.params
    const page = parseInt(params.page)
    const posts = await getPosts(page)
    console.log(posts)
    return <>See console for result</>
}
