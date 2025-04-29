/* Components */
import { PagesClient } from '@app/admin/_components/Pages-client'
/* Utils */
import { getPages } from '@app/admin/_lib/getPages'
import { updatePage } from '@app/admin/_lib/updatePage'
import { removePage } from '../_lib/removePage'

type Props = {
    page: number
}

export async function PagesServer({ page }: Props) {
    const pages = await getPages(page)

    const remove = async (slug: string): Promise<string> => {
        'use server'
        return await removePage(slug)
            .then(() => `Page ${slug} Removed`)
            .catch((e) => e.message)
    }
    const update = async (slug: string): Promise<string> => {
        'use server'
        return await updatePage(slug)
            .then(() => 'Update finished')
            .catch((e) => e.message)
    }

    return (
        <PagesClient
            update={update}
            remove={remove}
            pages={pages}
            page={page}
        />
    )
}
