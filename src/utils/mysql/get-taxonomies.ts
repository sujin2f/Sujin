import { CacheKeys } from 'src/constants/cache-keys'
import { MySQLQuery } from 'src/constants/mysql-query'
import { TermTypes } from 'src/types/wordpress'
import { Term } from 'src/types/wordpress'
import { cached } from 'src/utils/node-cache'
import { mysql } from 'src/utils/mysql/mysqld'

/**
 * Get Taxonomies from the post
 *
 * @param {number} postId
 * @return {Promise<Term[]>}
 */
export const getTaxonomies = async (postId: number): Promise<Term[]> => {
    const cache = cached.get<Term[]>(`${CacheKeys.TAXONOMY}-${postId}`)
    if (cache && process.env.MYSQL_CACHE_TTL) {
        return cache
    }

    const connection = await mysql()
    const result = await connection.query(MySQLQuery.getTaxonomies(postId))

    if (!result.length) {
        return []
    }
    const terms: Term[] = result.map((item: Record<string, string>) => ({
        ...item,
        type: TermTypes[item.type as keyof typeof TermTypes],
        page: 0,
    }))
    cached.set<Term[]>(`${CacheKeys.TAXONOMY}-${postId}`, terms)
    return terms
}
