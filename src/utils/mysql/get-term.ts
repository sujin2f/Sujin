import { CacheKeys, MySQLQuery } from 'src/constants'
import { Nullable, Term, TermTypes } from 'src/types'
import { isDev, cached, mysql } from 'src/utils'

/**
 * Get Term from ID
 *
 * @param {number} termId
 * @return {Promise<Nullable<Term>}
 */
export const getTerm = async (termId: number): Promise<Nullable<Term>> => {
    const cache = cached.get<Term>(`${CacheKeys.TERM}-${termId}`)
    if (cache && !isDev()) {
        return cache
    }

    const connection = await mysql()
    const result = await connection.query(MySQLQuery.getTerm(termId))

    if (!result.length) {
        return
    }
    const term: Term = {
        ...result[0],
        type: TermTypes[result[0].type as keyof typeof TermTypes],
    }
    cached.set<Term>(`${CacheKeys.TERM}-${termId}`, term)
    return term
}
