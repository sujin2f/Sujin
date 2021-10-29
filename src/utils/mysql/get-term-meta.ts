import { CacheKeys, MySQLQuery } from 'src/constants'
import { isDev, cached, mysql } from 'src/utils'

/**
 * Get Term from ID
 *
 * @param {number} termId
 * @return {Promise<Nullable<Term>}
 */
export const getTermMeta = async (
    id: number,
    metaKey: string,
): Promise<string> => {
    const cache = cached.get<string>(`${CacheKeys.TERM}-meta-${id}-${metaKey}`)
    if (cache && !isDev()) {
        return cache
    }

    const connection = await mysql()
    const result = await connection.query(MySQLQuery.getTermMeta(id, metaKey))

    if (!result.length) {
        return ''
    }

    cached.set<string>(`${CacheKeys.TERM}-meta-${id}-${metaKey}`, result[0])
    return result[0]
}
