import { SQL_GET_TERM_RELATION } from 'src/server/constants/query'
import { format } from 'src/utils/common'
import { mysql } from './mysqld'

/**
 * Get object IDs which related on the term
 *
 * @param {number} termId
 * @return {Promise<number[]>} Related object IDs
 */
export const getTermRelationship = async (
    termId: number,
): Promise<number[]> => {
    const connection = await mysql()
    const result = await connection.query(
        format(SQL_GET_TERM_RELATION, termId.toString()),
    )

    if (!result.length) {
        return []
    }

    return result.map((member: Record<'object_id', number>) => member.object_id)
}
