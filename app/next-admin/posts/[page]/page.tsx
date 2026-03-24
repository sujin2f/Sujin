'use server'
/* Components */
import { PostsClient } from '@app/next-admin/posts/[page]/page.client'
/* Utils */
import { postsAllAdmin } from '@lib/apollo/queries/wordpress/posts/postsAllAdmin'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function Posts({ params }: Props) {
    const { page: _page } = await params
    const page = parseInt(_page)
    async function action() {
        'use server'
        return await postsAllAdmin(page)
    }

    return <PostsClient action={action} page={page} />
}
