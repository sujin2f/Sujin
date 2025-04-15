/* Components */
import { getCachedArchive } from '@app/_lib/data/mongo/wordpress/archive'
import { ClientComponent } from './category-post-client'
/* Utils */
import {
    getArchivePosts,
    updateArchivePosts,
} from '@app/_lib/data/mongo/wordpress/post'
/* T_Types */
import { ARCHIVE } from '@app/_lib/types'
import { notFound } from 'next/navigation'

type Props = {
    page: string
    slug: string
}

export async function ServerComponent({ slug, ...props }: Props) {
    const page = parseInt(props.page)
    const archive = await getCachedArchive(slug, ARCHIVE.CATEGORY)
    if (!archive) notFound()
    const posts = await getArchivePosts(archive._id, page)

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
            slug={archive.slug}
        />
    )
}
