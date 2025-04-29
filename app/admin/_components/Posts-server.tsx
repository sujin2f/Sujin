import { ObjectId } from 'mongodb'
import { notFound } from 'next/navigation'
/* Models */
import { A_Error, NoContentError } from '@common/model/Error'
/* Components */
import { PostsComponent } from '@app/admin/_components/Posts-client'
/* Utils */
import { updateArchivePosts } from '@app/admin/_lib/updateArchivePosts'
import { getCachedArchive } from '@app/archive/_lib/getCachedArchive'
import { getArchivePosts } from '@app/archive/_lib/getArchivePosts'
/* T_Types */
import { ARCHIVE } from '@app/_lib/types'

type Props = {
    page: number
    slug: string
}

export async function PostsServer({ slug, page }: Props) {
    const archive = await getCachedArchive(slug, ARCHIVE.CATEGORY).catch(
        (e) => {
            if (e instanceof NoContentError) {
                e.log()
                notFound()
            }
            if (e instanceof A_Error) {
                e.log()
            }
            throw e
        },
    )
    const posts = await getArchivePosts(new ObjectId(archive._id), page)

    const update = async (slug: string, page: number) => {
        'use server'
        return await updateArchivePosts(ARCHIVE.CATEGORY, slug, page)
            .then(() => 'Done')
            .catch((e) => e.message)
    }

    return (
        <PostsComponent
            page={page}
            posts={posts}
            update={update}
            archive={archive}
        />
    )
}
