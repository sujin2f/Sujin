import { SQL_GET_TERM } from 'src/server/constants/query'
import { Nullable } from 'src/types'
import { Term } from 'src/types/wp'
import { format } from 'src/utils/common'
import { mysql } from './mysqld'

export const getTerm = async (termId: number): Promise<Nullable<Term>> => {
    const connection = await mysql()
    const result = await connection.query(format(SQL_GET_TERM, termId))
    if (!result.length) {
        return
    }
    return result[0]
}
