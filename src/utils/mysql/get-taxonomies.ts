import { CacheKeys, MySQLQuery } from 'src/constants'
import { Term, TermTypes } from 'src/types'
import { isDev, cached, mysql } from 'src/utils'

/**
 * Get Taxonomies from the post
 *
 * @param {number} postId
 * @return {Promise<Term[]>}
 */
export const getTaxonomies = async (postId: number): Promise<Term[]> => {
    const cache = cached.get<Term[]>(`${CacheKeys.TAXONOMY}-${postId}`)
    if (cache && !isDev()) {
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
    }))
    cached.set<Term[]>(`${CacheKeys.TAXONOMY}-${postId}`, terms)
    return terms
}
