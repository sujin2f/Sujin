/* Components */
import { ClientComponent } from './category-post-client'
/* Utils */
import {
    getArchivePosts,
    updateArchivePosts,
} from '@app/_lib/data/mongo/wordpress/post'
/* Types */
import { ARCHIVE } from '@app/_lib/types'

type Props = {
    page: string
    slug: string
}

export async function ServerComponent({ slug, ...props }: Props) {
    const page = parseInt(props.page)
    const posts = await getArchivePosts(ARCHIVE.CATEGORY, slug, page, false)

    const update = async (slug: string, page: number) => {
        'use server'
        return await updateArchivePosts(ARCHIVE.CATEGORY, slug, page)
            .then(() => 'Done')
            .catch((e) => e.message)
    }

    return (
        <ClientComponent
            page={page}
            posts={posts}
            update={update}
            slug={slug}
        />
    )
}
