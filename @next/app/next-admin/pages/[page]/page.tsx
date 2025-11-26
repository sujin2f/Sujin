/* Components */
import { PagesClient } from '@app/next-admin/pages/[page]/page.client'
/* Utils */
import { pages as getPages } from '@lib/apollo/queries/wordpress/pages/pages'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function Pages({ params }: Props) {
    const { page: _page } = await params
    const page = parseInt(_page)
    async function action() {
        'use server'
        return await getPages(page)
    }

    return <PagesClient action={action} page={page} />
}
