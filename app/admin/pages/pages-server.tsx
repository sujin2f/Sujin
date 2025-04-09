/* Components */
import { ClientComponent } from '@app/admin/pages/pages-client'
/* Utils */
import {
    removePage,
    updatePage,
    getPages,
} from '@app/_lib/data/mongo/wordpress/page'

type Props = {
    page: string
}

export async function ServerComponent(props: Props) {
    const page = parseInt(props.page)
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
        <ClientComponent
            update={update}
            remove={remove}
            pages={pages}
            page={page}
        />
    )
}
