'use server'
/* Components */
import { CategoriesClient } from '@app/next-admin/categories/[page]/page.client'
/* Utils */
import { categories as getCategories } from '@lib/apollo/queries/wordpress/archives/categories'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function Categories({ params }: Props) {
    const { page: _page } = await params
    const page = parseInt(_page)
    async function action() {
        'use server'
        return await getCategories(page)
    }

    return <CategoriesClient action={action} page={page} />
}
