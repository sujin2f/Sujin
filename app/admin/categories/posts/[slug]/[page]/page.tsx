import CategoryPosts from '@app/admin/categories/posts/[slug]/[page]/CategoryPosts'

type Props = {
    params: Promise<{
        page: string
        slug: string
    }>
}

export default async function Page(props: Props) {
    return <CategoryPosts {...props} />
}
