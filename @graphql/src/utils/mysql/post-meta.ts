/* Models */
import { select } from '@src/utils/mysql'
/* CONSTANTS */
import { WPQuery } from '@src/utils/mysql/wp-query'
/* Utils */
import { unserialize } from '@src/utils/mysql/utils'

type T_PostMeta = {
    meta_key: string
    meta_value: string
}

/**
 * Retrieve a post meta value from MySQL and coerce/unserialize it to the
 * desired type.
 *
 * - If the meta value is missing, returns `defaultValue`.
 * - If the meta value looks like a serialized PHP array/object it will be
 *   unserialized using `phpUnSerialize`.
 *
 * @param postId - The MySQL post ID.
 * @param metaKey - The meta key to retrieve.
 * @param defaultValue - Default value to return when the meta is absent or
 *                       cannot be parsed.
 * @returns The value parsed as `T`.
 */
export const getPostMeta = async <T extends Record<string, unknown> | string | number | boolean>(
    postId: number,
    metaKey: string,
    defaultValue: T,
): Promise<T> => {
    const value = await select<T_PostMeta>(WPQuery.getPostMeta(postId, metaKey))
        .then((value: T_PostMeta[]) => value[0])
        .catch(() => undefined)

    if (!value) {
        return defaultValue
    }

    return unserialize<T>(value.meta_value, defaultValue)
}
