import { CacheKeys, ErrorMessage, MySQLQuery } from 'src/constants'
import { cached, mysql } from 'src/utils'

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
    if (cache && process.env.USE_CACHE) {
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
