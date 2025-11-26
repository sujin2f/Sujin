'use server'
/* Components */
import { TagsClient } from '@app/next-admin/tags/[page]/page.client'
/* Utils */
import { tags as getTags } from '@lib/apollo/queries/wordpress/archives/tags'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function Tags({ params }: Props) {
    const { page: _page } = await params
    const page = parseInt(_page)
    async function action() {
        'use server'
        return await getTags(page)
    }

    return <TagsClient action={action} page={page} />
}
