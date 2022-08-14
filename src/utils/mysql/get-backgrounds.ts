import { CacheKeys } from 'src/constants/cache-keys'
import { ErrorMessage } from 'src/constants/errors'
import { MySQLQuery } from 'src/constants/mysql-query'
import { Image, Post } from 'src/types/wordpress'
import { cached } from 'src/utils/node-cache'
import { mysql } from 'src/utils/mysql/mysqld'
import { getAttachment } from 'src/utils/mysql/get-attachment'

/**
 * Get random backgrounds
 *
 * @return {Promise<Image[]>}
 * @throws
 */
export const getBackgrounds = async (): Promise<Image[]> => {
    const cache = cached.get<Image[]>(CacheKeys.BACKGROUND)
    if (cache && process.env.MYSQL_CACHE_TTL) {
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
