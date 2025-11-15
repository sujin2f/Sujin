import type { Types } from 'mongoose'
/* Models */
import Cached from '@sujin/node-cache'
/* T_Types */
/* Utils */
import { getCacheKey } from '@sujin/lib/utils/cache'
/* CONSTANTS */
import { COLLECTION, POST_IMAGE_LOCATION, ARCHIVE } from '@sujin/lib/constants'
import { T_Archive, T_MySQLPost } from '@sujin/lib/types'
import { Post } from '@src/schema/post'
import { convertWPImageURL } from '@src/utils/mongo/convertWPImageURL'
import { Archive } from '@src/schema/archive'

export const updatePost = async (post: T_MySQLPost) => {
    const slug = post.slug
    const archives: Types.ObjectId[] = []

    Cached.getInstance().flush(getCacheKey(COLLECTION.POST, slug))

    // Image
    Object.keys(post.images).forEach((key) => {
        const imageKey = key as POST_IMAGE_LOCATION
        post.images[imageKey] = convertWPImageURL(post.images[imageKey]!)
    })

    for (const term of post.terms.filter(
        (term: T_Archive) =>
            term.type === ARCHIVE.CATEGORY || term.type === ARCHIVE.TAG,
    )) {
        await Archive.findOne({
            slug: term.slug,
            type: term.type,
        }).then(async (archive) => {
            if (archive) {
                archives.push(archive._id)
                return
            }

            await Archive.insertOne({ ...term, hits: 0, total: 0 }).then(
                (result) => {
                    archives.push(result._id)
                },
            )
        })
    }

    await Post.findOneAndReplace({ slug }, { ...post, archives }).then(
        async (result) => {
            if (!result) {
                await Post.insertOne({ ...post, archives })
            }
        },
    )

    return archives
}
