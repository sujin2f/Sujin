import { CacheKeys, MySQLQuery, PER_PAGE } from 'src/constants'
import { GetTermByArgs, Nullable, Term, TermTypes } from 'src/types'
import { cached, mysql } from 'src/utils'

/**
 * Get Term from ID
 *
 * @param {number} termId
 * @return {Promise<Nullable<Term>}
 */
export const getTermBy = async ({
    key,
    value,
}: GetTermByArgs): Promise<Nullable<Term>> => {
    const cache = cached.get<Term>(`${CacheKeys.TERM}-${key}-${value}`)
    if (cache && process.env.USE_CACHE) {
        return cache
    }

    const connection = await mysql()
    const result = await connection.query(
        MySQLQuery.getTermBy(key, value.toString()),
    )

    if (!result.length) {
        return
    }

    const pages = Math.ceil(parseInt(result[0].total) / PER_PAGE)
    // const thumbnail = await getTermMeta(parseInt(result[0].id), 'thumbnail')
    const term: Term = {
        ...result[0],
        type: TermTypes[result[0].type as keyof typeof TermTypes],
        limit: PER_PAGE,
        pages,
    }
    cached.set<Term>(`${CacheKeys.TERM}-${key}-${value}`, term)
    return term
}
