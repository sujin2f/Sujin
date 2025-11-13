import type { Types } from 'mongoose'
import sanitize from 'mongo-sanitize'
/* Models */
import Logger from '@src/utils/logger'
import Cached from '@sujin/node-cache'
import { mysqlDisconnect } from '@src/utils/mysql'
/* T_Types */
import type { MutationResultType } from '@src/types'
/* Utils */
import { getPostBy } from '@src/utils/mysql/post'
import { getCacheKey } from '@sujin/lib/utils/cache'
import { updateTotal } from '@src/utils/mongo/updateTotal'
/* CONSTANTS */
import {
    ARCHIVE,
    COLLECTION,
    POST_IMAGE_LOCATION,
    POST_TYPE,
    T_Archive,
    T_MySQLPost,
} from '@sujin/lib/types'
import { Post } from '@src/schema/post'
import { convertWPImageURL } from '@src/utils/mongo/convertWPImageURL'
import { Archive } from '@src/schema/archive'

export const updatePost = async (post: T_MySQLPost) => {
    const slug = post.slug
    const archives: Types.ObjectId[] = []

    Cached.getInstance().flush(getCacheKey(COLLECTION.POST, slug))
    await getPostBy('slug', slug, POST_TYPE.POST, true).then(async (post) => {
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

        await updateTotal(archives)
    })
    await mysqlDisconnect()
}

type Param = {
    nonce: string
    slug: string
}

export const mutatePost = async (
    _: unknown,
    { slug: _slug }: Param,
): Promise<MutationResultType> => {
    Logger.info(`🤟 mutatePost mutation has been requested: ${_slug}`)
    const slug = sanitize(_slug)

    Cached.getInstance().flush(getCacheKey(COLLECTION.POST, slug))
    await getPostBy('slug', slug, POST_TYPE.POST, true).then(async (post) => {
        await updatePost(post)
    })

    Logger.info('🤟 mutatePost query has been finished')
    return {
        result: true,
    }
}
