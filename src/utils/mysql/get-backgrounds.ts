import { MySQLQuery, CacheKeys, ErrorMessage } from 'src/constants'
import { Image, Post } from 'src/types'
import { cached, mysql } from 'src/utils'
import { getAttachment } from 'src/utils/mysql/get-attachment'

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

    const result: Image[] = []

    for (const post of posts) {
        const image = await getAttachment(post.id).catch(() => undefined)

        if (image) {
            result.push(image)
        }
    }
    cached.set<Image[]>(CacheKeys.BACKGROUND, result)
    return result
}
