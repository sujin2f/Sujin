import { MySQLQuery, CacheKeys } from 'src/constants'
import { cached, mysql } from 'src/utils'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PHPUnserialize = require('php-unserialize')

/**
 * Get the post meta value
 *
 * @param {number} postId
 * @param {string} metaKey
 * @return {Promise<string>}
 */
export const getPostMeta = async (
    postId: number,
    metaKey: string,
): Promise<string> => {
    const cache = cached.get<string>(
        `${CacheKeys.POST_META}-${postId}-${metaKey}`,
    )
    if (cache) {
        return cache
    }

    const connection = await mysql()
    const result = await connection.query(
        MySQLQuery.getPostMeta(postId, metaKey),
    )

    if (!result.length) {
        return ''
    }

    const value = result[0].meta_value

    // Serialize
    if (value.startsWith('a:') && value.endsWith('}')) {
        return PHPUnserialize.unserialize(result[0].meta_value)
    }

    cached.set<string>(`${CacheKeys.POST_META}-${postId}-${metaKey}`, value)
    return value
}
