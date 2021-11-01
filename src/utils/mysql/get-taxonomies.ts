import { CacheKeys, MySQLQuery } from 'src/constants'
import { TermTypes } from 'src/types'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Term } from 'src/types'
import { cached, mysql } from 'src/utils'

/**
 * Get Taxonomies from the post
 *
 * @param {number} postId
 * @return {Promise<Term[]>}
 */
export const getTaxonomies = async (postId: number): Promise<Term[]> => {
    const cache = cached.get<Term[]>(`${CacheKeys.TAXONOMY}-${postId}`)
    if (cache && process.env.USE_CACHE) {
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
