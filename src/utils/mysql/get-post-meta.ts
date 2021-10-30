import { MySQLQuery, CacheKeys } from 'src/constants'
import { cached, isDev, mysql } from 'src/utils'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PHPUnserialize = require('php-unserialize')

/**
 * Get the post meta value
 *
 * @param {number} postId
 * @param {string} metaKey
 * @return {Promise<string>}
 */
export const getPostMeta = async <T = string>(
    postId: number,
    metaKey: string,
): Promise<T> => {
    const cache = cached.get<T>(`${CacheKeys.POST_META}-${postId}-${metaKey}`)
    if (cache && !isDev()) {
        return cache
    }

    const connection = await mysql()
    const result = await connection.query(
        MySQLQuery.getPostMeta(postId, metaKey),
    )

    if (!result.length) {
        cached.set<T>(
            `${CacheKeys.POST_META}-${postId}-${metaKey}`,
            ('' as unknown) as T,
        )
        return ('' as unknown) as T
    }

    const value = result[0].meta_value

    // Serialize
    if (value.startsWith('a:') && value.endsWith('}')) {
        const object = PHPUnserialize.unserialize(result[0].meta_value)
        cached.set<T>(`${CacheKeys.POST_META}-${postId}-${metaKey}`, object)
        return object
    }

    cached.set<T>(`${CacheKeys.POST_META}-${postId}-${metaKey}`, value)
    return value
}
