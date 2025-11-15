import { ObjectId } from 'mongodb'
import sanitize from 'mongo-sanitize'
/* Models */
import Cached from '@sujin/common/model/Cached'
import { A_Error, NoContentError } from '@sujin/common/model/Error'
/* Components */
import { PostsComponent } from '@app/admin/_components/Posts.client'
/* Utils */
import { getCachedArchive } from '@app/_lib/utils/mongo/getCachedArchive'
import { getArchivePosts } from '@app/_lib/utils/mongo/getArchivePosts'
import { getPostsBy } from '@app/_lib/utils/mysql/getPostsBy'
import { getCacheKey } from '@app/_lib/utils/cache'
import { auth } from '@app/api/auth/_lib/utils-mysql'
import { updateTotal } from '@app/_lib/utils/mongo/updateTotal'
import { updateFromMySQL } from '@app/_lib/utils/mongo/updateFromMySQL'
/* CONSTANTS */
import { ARCHIVE, COLLECTION, POST_TYPE, type T_Archive } from '@app/_lib/types'
/* T_Types */
import { mongoStringify } from '@sujin/common/utils/object'

type Props = {
    page: number
    slug: string
}

export async function PostsServer({ slug, page }: Props) {
    const archive = await getCachedArchive(slug, ARCHIVE.CATEGORY).catch(
        (e) => {
            if (e instanceof NoContentError) {
                return e.metadata as T_Archive
            }
            if (e instanceof A_Error) {
                e.log()
            }
            throw e
        },
    )
    const posts = await getArchivePosts(new ObjectId(archive._id), page).catch(
        () => [],
    )

    const update = async (slug: string, page: number) => {
        'use server'
        return await updateArchivePosts(ARCHIVE.CATEGORY, slug, page)
            .then(() => 'Done')
            .catch((e) => e.message)
    }

    return (
        <PostsComponent
            page={page}
            posts={posts.map((v) => mongoStringify(v))}
            update={update}
            archive={mongoStringify(archive)}
        />
    )
}

const updateArchivePosts = async (
    _type: ARCHIVE,
    _slug: string,
    page: number,
) => {
    const type = sanitize(_type)
    const slug = sanitize(_slug)
    await auth()
    Cached.getInstance().flush(getCacheKey(COLLECTION.POST))
    Cached.getInstance().flush(getCacheKey(COLLECTION.ARCHIVE, type, slug))

    await getPostsBy(type, POST_TYPE.POST, slug, page, true).then(
        async (result) => {
            const archives: ObjectId[] = []
            for (const item of result) {
                archives.push(...(await updateFromMySQL(item)))
            }
            await updateTotal(archives)
        },
    )
}
