import { MetaKeys, CacheKeys, ErrorMessage } from 'src/constants'
import { Image, ImageSizes } from 'src/types'
import { cached, getPostMeta, getPostsBy } from 'src/utils'

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
    if (cache && process.env.USE_CACHE) {
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
            const url = new URL(post[0].link)
            const path = url.pathname.split('/')
            path.pop()

            const file = `${url.origin}/${path.join('/')}/${
                meta.sizes[sizeKey].file
            }`
            sizes.push({
                key: sizeKey,
                file,
            })
        })
    }

    const attachement: Image = {
        url,
        mimeType: post[0].mimeType,
        title: post[0].title,
        sizes,
    }

    cached.set<Image>(cacheKey, attachement)
    return attachement
}
