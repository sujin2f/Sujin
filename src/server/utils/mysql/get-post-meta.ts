import { SQL_GET_POST_META } from 'src/server/constants/query'
import { format } from 'src/utils/common'
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

    return value
}
