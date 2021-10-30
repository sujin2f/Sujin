import { MySQLQuery, MetaKeys, CacheKeys } from 'src/constants'
import { Image, ImageSizes } from 'src/types'
import { isDev, cached, getPostMeta, mysql } from 'src/utils'

/**
 * Get random backgrounds
 *
 * @return {Promise<Background[]>}
 */
export const getBackgrounds = async (): Promise<Image[]> => {
    const cache = cached.get<Image[]>(CacheKeys.BACKGROUND)
    if (cache && !isDev()) {
        return cache
    }

    const connection = await mysql()
    const query = MySQLQuery.getRandomBackgrounds()
    const posts = await connection.query(query)

    if (!posts.length) {
        return []
    }

    const backgrounds: Image[] = []

    for (const post of posts) {
        const sizes: ImageSizes = []
        // eslint-disable-next-line @typescript-eslint/ban-types
        const attachmentMeta = await getPostMeta<
            Record<string, Record<string, Record<string, string>>>
        >(post.id, MetaKeys.ATTACHMENT_META)
        if (attachmentMeta.sizes) {
            Object.keys(attachmentMeta.sizes).forEach((sizeKey) => {
                const url = new URL(post.link)
                const path = url.pathname.split('/')
                path.pop()

                sizes.push({
                    key: sizeKey,
                    file: `${url.origin}/${path.join('/')}/${
                        attachmentMeta.sizes[sizeKey].file
                    }`,
                })
            })
        }

        backgrounds.push({
            url: post.link,
            mimeType: post.mimeType,
            sizes,
        })
    }
    cached.set<Image[]>(CacheKeys.BACKGROUND, backgrounds)
    return backgrounds
}
