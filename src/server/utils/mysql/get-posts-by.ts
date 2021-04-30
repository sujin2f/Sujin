import { SQL_GET_POST_BY, SQL_GET_TERM_ITEMS } from 'src/server/constants/query'
import { Post } from 'src/types'
import { format } from 'src/utils/common'
import { mysql } from './mysqld'

export const getPostsBy = async (
    key: string,
    value: string | number,
): Promise<Post[]> => {
    const connection = await mysql()
    let result = []
    switch (key) {
        case 'id':
            result = await connection.query(
                format(SQL_GET_POST_BY, 'post.ID', value),
            )
            break
        case 'category':
            result = await connection.query(format(SQL_GET_TERM_ITEMS, value))
            break
    }

    if (!result.length) {
        return []
    }
    return result
}
