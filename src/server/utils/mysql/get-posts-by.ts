import { SQL_GET_POST_BY, SQL_GET_TERM_ITEMS } from 'src/constants/query'
import { Post } from 'src/types'
import { format } from 'src/utils/common'
import { cached } from '../node-cache'
import { mysql } from './mysqld'

/**
 * Get posts
 *
 * @param {string} key
 * @param {string | number} value
 * @return {Promise<Post[]>}
 */
export const getPostsBy = async (
    key: string,
    value: string | number,
): Promise<Post[]> => {
    const cache = cached.get<Post[]>(`mysql-get-posts-by-${key}-${value}`)
    if (cache) {
        return cache
    }

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
    cached.set<Post[]>(`mysql-get-posts-by-${key}-${value}`, result)
    return result
}
