import { MySQLQuery, CacheKeys } from 'src/constants'
import { Nullable } from 'src/types'
import { cached, mysql } from 'src/utils'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PHPUnserialize = require('php-unserialize')

/**
 * WP get_option()
 *
 * @template T Unknown. Default is string
 * @param {string} optionName
 * @param {Nullable<string>} key
 * @return {Promise<Nullable<T>>}
 */
export const getOption = async <T>(
    optionName: string,
    key?: Nullable<string>,
): Promise<Nullable<T>> => {
    const cache = cached.get<Nullable<T>>(
        `${CacheKeys.OPTION}-${optionName}-${key}`,
    )
    if (cache && process.env.USE_CACHE) {
        return cache
    }

    const connection = await mysql()
    const result = await connection
        .query(MySQLQuery.getOption(optionName))
        .catch((e) => console.error(e))

    if (!result || !result.length) {
        return
    }

    const value = result[0].option_value as string

    // Serialize
    if (value.startsWith('a:') && value.endsWith('}')) {
        const serialized = PHPUnserialize.unserialize(result[0].option_value)
        if (key) {
            return serialized[key]
        }
        return serialized
    }

    cached.set<Nullable<T>>(
        `${CacheKeys.OPTION}-${optionName}-${key}`,
        value as unknown as T,
    )
    return value as unknown as T
}
