import { MySQLQuery, MetaKeys, CacheKeys } from 'src/constants'
import { Background, Post } from 'src/types'
import { isDev, cached, getPostMeta, mysql } from 'src/utils'

/**
 * Get random backgrounds
 *
 * @return {Promise<Background[]>}
 */
export const getBackgrounds = async (): Promise<Background[]> => {
    const cache = cached.get<Background[]>(CacheKeys.BACKGROUND)
    if (cache && !isDev()) {
        return cache
    }

    const connection = await mysql()
    const query = MySQLQuery.getRandomBackgrounds()
    const posts = await connection.query(query)

    if (!posts.length) {
        return []
    }

    const backgrounds = []

    for (const item of posts) {
        const post = (item as unknown) as Post
        const result = await getPostMeta(post.id, MetaKeys.ATTACHMENT_META)
        const meta = (result as unknown) as {
            sizes: { [size: string]: { file: string } }
        }
        const mobile =
            (meta.sizes.medium_large && meta.sizes.medium_large.file) ||
            (meta.sizes.medium && meta.sizes.medium.file) ||
            undefined
        if (mobile) {
            backgrounds.push({
                desktop: post.link,
                mobile: post.link.replace(
                    // @todo
                    /\/([0-9a-zA-Z-_\.]+)$/,
                    `/${mobile}`,
                ),
            })
        }
    }
    cached.set<Background[]>(CacheKeys.BACKGROUND, backgrounds)
    return backgrounds
}
