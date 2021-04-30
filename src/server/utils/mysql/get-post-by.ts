import { SQL_GET_POST_BY } from 'src/server/constants/query'
import { Nullable, Post } from 'src/types'
import { format } from 'src/utils/common'
import { mysql } from './mysqld'

export const getPostBy = async (
    key: string,
    value: string | number,
): Promise<Nullable<Post>> => {
    const connection = await mysql()
    let result = []
    switch (key) {
        case 'id':
            result = await connection.query(
                format(SQL_GET_POST_BY, 'ID', value),
            )
    }

    if (!result.length) {
        return
    }
    return result[0]
}
