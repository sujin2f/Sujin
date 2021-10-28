import { SQL_GET_ALL_POST_META } from 'src/constants/query'
import { format } from 'src/utils'
import { cached } from 'src/server/utils/node-cache'
import { mysql } from './mysqld'

type PostMeta = {
    meta_key: string
    meta_value: string
}
type PostMetas = Record<string, string>

/**
 * Get all post meta
 *
 * @param {number} postId
 * @return {Promise<PostMetas>}
 */
export const getAllPostMeta = async (postId: number): Promise<PostMetas> => {
    const cache = cached.get<PostMetas>(`mysql-get-all-post-meta-${postId}`)
    if (cache) {
        return cache
    }
    const connection = await mysql()
    const query = format(SQL_GET_ALL_POST_META, postId)
    const result = (await connection.query(query)).reduce(
        (acc: PostMetas, member: PostMeta) => {
            acc[member.meta_key] = member.meta_value
            return acc
        },
        {},
    )
    cached.set<PostMetas>(`mysql-get-all-post-meta-${postId}`, result)
    return result
}
