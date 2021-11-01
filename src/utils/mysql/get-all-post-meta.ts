import { MySQLQuery, CacheKeys } from 'src/constants'
import { cached, mysql } from 'src/utils'

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
    const cache = cached.get<PostMetas>(`${CacheKeys.POST_META}-${postId}`)
    if (cache && process.env.USE_CACHE) {
        return cache
    }
    const connection = await mysql().catch((e) => console.error(e))
    if (!connection) {
        return {}
    }
    const query = MySQLQuery.getAllPostMeta(postId)
    const result = (
        await connection.query(query).catch((e) => console.error(e))
    ).reduce((acc: PostMetas, member: PostMeta) => {
        acc[member.meta_key] = member.meta_value
        return acc
    }, {})
    cached.set<PostMetas>(`${CacheKeys.POST_META}-${postId}`, result)
    return result
}