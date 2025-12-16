/* Models */
import { Logger } from '@sujin/share/model/Logger'
/* Utils */
import { phpUnSerialize } from '@sujin/share/utils/string'

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
export const unserialize = <T extends Record<string, unknown> | string | number | boolean>(
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
        Logger.error(`⛈️ phpUnSerialize could not parse the value ${value} ${e}`)
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
