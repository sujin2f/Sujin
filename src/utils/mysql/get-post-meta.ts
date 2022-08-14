import { CacheKeys } from 'src/constants/cache-keys'
import { ErrorMessage } from 'src/constants/errors'
import { MySQLQuery } from 'src/constants/mysql-query'
import { cached } from 'src/utils/node-cache'
import { mysql } from 'src/utils/mysql/mysqld'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PHPUnserialize = require('php-unserialize')

/**
 * Get the post meta value
 *
 * @param {number} postId
 * @param {string} metaKey
 * @return {Promise<string>}
 */
export const getPostMeta = async <T = string>(
    postId: number,
    metaKey: string,
): Promise<T> => {
    const cacheKey = `${CacheKeys.POST_META}-${postId}-${metaKey}`
    const cache = cached.get<T | string>(cacheKey)
    if (cache && process.env.MYSQL_CACHE_TTL) {
        if (cache === 'NOT_FOUND') {
            throw new Error(ErrorMessage.POST_META_NOT_FOUND)
        }
        return cache as T
    }

    // MySQL connection
    const connection = await mysql().catch(() => {
        throw new Error(ErrorMessage.MYSQL_CONNECTION)
    })
    const dbResult = await connection
        .query(MySQLQuery.getPostMeta(postId, metaKey))
        .catch((e) => console.log(e))

    if (!dbResult.length) {
        cached.set<T>(cacheKey, 'NOT_FOUNT' as unknown as T)
        throw new Error(ErrorMessage.POST_META_NOT_FOUND)
    }

    const value = dbResult[0].meta_value

    // Serialize
    if (value.startsWith('a:') && value.endsWith('}')) {
        const object = PHPUnserialize.unserialize(dbResult[0].meta_value)
        cached.set<T>(cacheKey, object)
        return object
    }

    cached.set<T>(cacheKey, value)
    return value
}
