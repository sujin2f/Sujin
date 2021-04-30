import { SQL_GET_OPTION } from 'src/server/constants/query'
import { Nullable } from 'src/types'
import { format } from 'src/utils/common'
import { mysql } from './mysqld'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PHPUnserialize = require('php-unserialize')

/**
 * WP get_option()
 *
 * @template T Unknown. Default is string
 * @param {string} optionName
 * @param {false} unserialize If true, unserialize (PHP) the value
 * @return {Promise<Nullable<T>>}
 */
export const getOption = async <T>(
    optionName: string,
    key: Nullable<string> = undefined,
): Promise<Nullable<T>> => {
    const connection = await mysql()
    const result = await connection
        .query(format(SQL_GET_OPTION, optionName))
        .catch((e) => console.error(e))

    if (!result.length) {
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

    return (value as unknown) as T
}
