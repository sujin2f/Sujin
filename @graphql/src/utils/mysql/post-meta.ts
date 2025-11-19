/* Models */
import { select } from '@src/utils/mysql'
import Logger from '@src/utils/logger'
/* CONSTANTS */
import { WPQuery } from '@src/utils/mysql/wp-query'
/* Utils */
import { phpUnSerialize } from '@sujin/share/utils/string'

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
export const getPostMeta = async <
    T extends Record<string, unknown> | string | number | boolean,
>(
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

/**
 * Internal helper to coerce / unserialize a stored meta value.
 *
 * Handles boolean/number casting when `defaultValue` is not a string.
 * For string defaults it will attempt to detect PHP serialized arrays (`a:...}`)
 * and use `phpUnSerialize` to convert them to JS objects.
 *
 * @param value - Raw string from the DB.
 * @param defaultValue - Default fallback typed as `T`.
 * @param key - Optional key to extract from an object result.
 */
const unserialize = <
    T extends Record<string, unknown> | string | number | boolean,
>(
    value: string,
    defaultValue: T,
    key?: string,
): T => {
    if (typeof defaultValue !== 'string') {
        switch (typeof defaultValue) {
            case 'boolean':
                return !!value as T
            case 'number':
                return (parseInt(value) as T) || defaultValue
        }
    }

    if (!value) {
        return defaultValue
    }

    if (!value.startsWith('a:') || !value.endsWith('}')) {
        return value as T
    }

    let result
    try {
        result = phpUnSerialize(value)
    } catch (e) {
        Logger.error(
            `⛈️ phpUnSerialize could not parse the value ${value} ${e}`,
        )
        throw Error('phpUnSerialize could not parse the value')
    }

    if (key && typeof result === 'object') {
        if (Object.keys(result as object).includes(key)) {
            return (result as Record<string, T>)[key]
        }
        return defaultValue
    }
    return result as T
}
