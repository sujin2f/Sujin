import { CacheKeys } from 'src/constants/cache-keys'
import { ErrorMessage } from 'src/constants/errors'
import { MySQLQuery } from 'src/constants/mysql-query'
import { cached } from 'src/utils/node-cache'
import { mysql } from 'src/utils/mysql/mysqld'

/**
 * Get Term from ID
 *
 * @param {number} termId
 * @return {Promise<Nullable<Term>}
 */
export const getTermMeta = async <T = string>(
    id: number,
    metaKey: string,
): Promise<T> => {
    const cacheKey = `${CacheKeys.TERM}-meta-${id}-${metaKey}`
    const cache = cached.get<T | string>(cacheKey)
    if (cache && process.env.MYSQL_CACHE_TTL) {
        if (cache === 'NOT_FOUND') {
            throw new Error(ErrorMessage.TERM_META_NOT_FOUND)
        }
        return cache as T
    }

    const connection = await mysql().catch(() => {
        throw new Error(ErrorMessage.MYSQL_CONNECTION)
    })
    const result = await connection
        .query(MySQLQuery.getTermMeta(id, metaKey))
        .catch(() => [])

    if (!result.length) {
        cached.set<string>(cacheKey, 'NOT_FOUND')
        throw new Error(ErrorMessage.TERM_META_NOT_FOUND)
    }

    cached.set<T>(cacheKey, result[0])
    return result[0]
}
