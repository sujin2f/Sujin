import { SQL_GET_POST_META } from 'src/constants/query'
import { format } from 'src/utils/common'
import { cached } from '../node-cache'
import { mysql } from './mysqld'

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
    const cache = cached.get<string>(`mysql-get-post-meta-${postId}-${metaKey}`)
    if (cache) {
        return cache
    }

    const connection = await mysql()
    const result = await connection.query(
        format(SQL_GET_POST_META, postId, metaKey),
    )

    if (!result.length) {
        return ''
    }

    const value = result[0].meta_value

    // Serialize
    if (value.startsWith('a:') && value.endsWith('}')) {
        return PHPUnserialize.unserialize(result[0].meta_value)
    }

    cached.set<string>(`mysql-get-post-meta-${postId}-${metaKey}`, value)
    return value
}
