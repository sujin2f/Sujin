/* Utils */
import { ARCHIVE } from '@app/_lib/types'
import { CategoriesClient } from '@app/admin/_components/Categories-client'
import { getArchives } from '@app/admin/_lib/getArchives'
import { updateArchive } from '@app/admin/_lib/updateArchive'
import { removeArchive } from '@app/admin/_lib/removeArchive'

type Props = {
    page: number
}

export async function CategoriesServer({ page }: Props) {
    const categories = await getArchives(ARCHIVE.CATEGORY, page)

    const update = async (slug: string): Promise<string> => {
        'use server'
        if (!slug) return ''
        return await updateArchive(slug, ARCHIVE.CATEGORY)
            .then(() => `Category ${slug} Updated`)
            .catch((e) => e.message)
    }

    const remove = async (slug: string): Promise<string> => {
        'use server'
        if (!slug) return ''
        return await removeArchive(slug, ARCHIVE.CATEGORY)
            .then(() => `Category ${slug} Removed`)
            .catch((e) => e.message)
    }

    return (
        <CategoriesClient
            update={update}
            remove={remove}
            categories={categories}
            page={page}
        />
    )
}
