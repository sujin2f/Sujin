import { SQL_GET_TERM } from 'src/constants/query'
import { Nullable } from 'src/types'
import { Term } from 'src/types/wp'
import { format } from 'src/utils/common'
import { cached } from '../node-cache'
import { mysql } from './mysqld'

/**
 * Get Term from ID
 *
 * @param {number} termId
 * @return {Promise<Nullable<Term>}
 */
export const getTerm = async (termId: number): Promise<Nullable<Term>> => {
    const cache = cached.get<Term>(`mysql-get-term-${termId}`)
    if (cache) {
        return cache
    }

    const connection = await mysql()
    const result = await connection.query(format(SQL_GET_TERM, termId))
    if (!result.length) {
        return
    }
    cached.set<Term>(`mysql-get-term-${termId}`, result[0])
    return result[0]
}
