/* Utils */
import {
    getCategories,
    updateCategory,
    removeCategory,
} from '@app/_lib/data/mongo/wordpress/category'
import { ClientComponent } from '@app/admin/categories/categories-client'

type Props = {
    page: string
}

export async function ServerComponent(props: Props) {
    const page = parseInt(props.page)
    const categories = await getCategories(page)

    const update = async (slug: string): Promise<string> => {
        'use server'
        if (!slug) return ''
        return await updateCategory(slug)
            .then(() => `Category ${slug} Updated`)
            .catch((e) => e.message)
    }

    const remove = async (slug: string): Promise<string> => {
        'use server'
        if (!slug) return ''
        return await removeCategory(slug)
            .then(() => `Category ${slug} Removed`)
            .catch((e) => e.message)
    }

    return (
        <ClientComponent
            update={update}
            remove={remove}
            categories={categories}
            page={page}
        />
    )
}
