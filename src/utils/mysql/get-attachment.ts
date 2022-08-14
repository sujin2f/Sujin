import { CacheKeys } from 'src/constants/cache-keys'
import { ErrorMessage } from 'src/constants/errors'
import { MetaKeys } from 'src/constants/mysql-query'
import { Image, ImageSizes } from 'src/types/wordpress'
import { cached } from 'src/utils/node-cache'
import { getPostsBy } from 'src/utils/mysql/get-posts-by'
import { getPostMeta } from 'src/utils/mysql/get-post-meta'

type AttachmentRawData = Record<string, Record<string, Record<string, string>>>

/**
 * Get attachment
 *
 * @param {number} postId
 * @return {Image}
 * @throws
 */
export const getAttachment = async (postId: number): Promise<Image> => {
    // Caching
    const cacheKey = `${CacheKeys.ATTACHMENT}-${postId}`
    const cache = cached.get<Image | string>(cacheKey)
    if (cache && process.env.MYSQL_CACHE_TTL) {
        if (typeof cache === 'string') {
            throw new Error(ErrorMessage.ATTACHMENT_NOT_FOUND)
        }
        return cache
    }

    // MySQL query
    const post = await getPostsBy('id', postId, 1, true).catch(() => undefined)
    const meta = await getPostMeta<AttachmentRawData>(
        postId,
        MetaKeys.ATTACHMENT_META,
    ).catch(() => undefined)

    if (!post || !post.length || !meta) {
        cached.set<string>(cacheKey, 'NOT_FOUND')
        throw new Error(ErrorMessage.POST_META_NOT_FOUND)
    }

    // Map sizes
    const sizes: ImageSizes = []
    const url = post[0].link.replace(
        /[0-9]+\/[0-9]+\/.+$/,
        meta.file as unknown as string,
    )
    if (meta.sizes) {
        Object.keys(meta.sizes).forEach((sizeKey) => {
            const sizeUrl = new URL(post[0].link)
            const path = sizeUrl.pathname.split('/')
            path.pop()

            const file = `${sizeUrl.origin}/${path
                .filter((v) => v)
                .join('/')}/${meta.sizes[sizeKey].file}`
            sizes.push({
                key: sizeKey,
                file,
            })
        })
    }

    const attachment: Image = {
        url,
        mimeType: post[0].mimeType,
        title: post[0].title,
        sizes,
    }

    cached.set<Image>(cacheKey, attachment)
    return attachment
}
