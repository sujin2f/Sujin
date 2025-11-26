/* Components */
import { CategoryPostsClient } from '@app/next-admin/categories/posts/[slug]/[page]/page.client'
/* Utils */
import { postsAdmin } from '@lib/apollo/queries/wordpress/posts/postsAdmin'

type Props = {
    params: Promise<{
        page: string
        slug: string
    }>
}

export default async function CategoryPosts(props: Props) {
    const { page: _page, slug } = await props.params
    const page = parseInt(_page)
    async function action() {
        'use server'
        return await postsAdmin(slug, page)
    }

    return <CategoryPostsClient action={action} page={page} slug={slug} />
}
