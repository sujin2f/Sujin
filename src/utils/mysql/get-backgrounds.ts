import { MySQLQuery, CacheKeys, ErrorMessage } from 'src/constants'
import { Image, Post } from 'src/types'
import { cached, getAttachment, mysql } from 'src/utils'

/**
 * Get random backgrounds
 *
 * @return {Promise<Image[]>}
 * @throws
 */
export const getBackgrounds = async (): Promise<Image[]> => {
    const cache = cached.get<Image[]>(CacheKeys.BACKGROUND)
    if (cache && process.env.USE_CACHE) {
        return cache
    }

    // MySQL connection
    const connection = await mysql().catch(() => {
        throw new Error(ErrorMessage.MYSQL_CONNECTION)
    })
    const posts: Post[] = await connection
        .query(MySQLQuery.getRandomBackgrounds())
        .catch(() => [])

    if (!posts.length) {
        cached.set<Image[]>(CacheKeys.BACKGROUND, [])
        return []
    }

    const backgrounds: Image[] = []

    for (const post of posts) {
        const image = await getAttachment(post.id).catch(() => undefined)

        if (image) {
            backgrounds.push(image)
        }
    }
    cached.set<Image[]>(CacheKeys.BACKGROUND, backgrounds)
    return backgrounds
}
