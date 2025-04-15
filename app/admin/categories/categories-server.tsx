/* Utils */
import { getArchives } from '@app/_lib/data/mongo/wordpress/archive'
import {
    updateCategory,
    removeCategory,
} from '@app/_lib/data/mongo/wordpress/category'
import { ARCHIVE } from '@app/_lib/types'
import { ClientComponent } from '@app/admin/categories/categories-client'

type Props = {
    page: string
}

export async function ServerComponent(props: Props) {
    const page = parseInt(props.page)
    const categories = await getArchives(ARCHIVE.CATEGORY, page).then(
        (categories) =>
            categories.map((category) => ({
                ...category,
                _id: category._id.toString(),
            })),
    )

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
