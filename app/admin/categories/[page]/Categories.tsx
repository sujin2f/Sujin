/* Components */
import { PrevNext } from '@app/components/single/PrevNext'
import CategoriesTable from '@app/admin/categories/[page]/CategoriesTable'
/* Constants */
import { PER_PAGE } from '@app/helpers/constants/mysql-query'
/* Utils */
import {
    getCategories,
    updateCategory,
} from '@app/helpers/data/mongo/wordpress/category'
/* Types */
import type { PostType } from '@app/helpers/types/wordpress'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function Categories(props: Props) {
    const params = await props.params
    const page = parseInt(params.page)
    const terms = await getCategories(page)

    const update = async (slug: string) => {
        'use server'
        if (!slug) return
        await updateCategory(slug)
    }

    const prev =
        page !== 1
            ? ({
                  title: 'Prev',
                  link: `/admin/categories/${page - 1}`,
              } as PostType)
            : undefined
    const next =
        terms.length === PER_PAGE
            ? ({
                  title: 'Next',
                  link: `/admin/categories/${page + 1}`,
              } as PostType)
            : undefined

    return (
        <>
            <h2>Categories</h2>
            <CategoriesTable terms={terms} update={update} />
            <PrevNext posts={[prev, next]} />
        </>
    )
}
