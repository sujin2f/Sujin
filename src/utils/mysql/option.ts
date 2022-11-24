import { MySQLQuery } from 'src/constants/mysql-query'
import { Nullable } from 'src/types/common'
import { MySQL } from 'src/utils/mysql/mysqld'
import { isSerialized } from '../wordpress'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PHPUnserialize = require('php-unserialize')

export const getOption = async <T>(
    optionName: string,
    key?: Nullable<string>,
): Promise<Nullable<T>> => {
    const result = await MySQL.getInstance().query<any[]>(
        MySQLQuery.getOption(optionName),
        [],
    )

    if (!result.length) {
        return
    }

    const value = result[0].option_value as string

    // Serialize
    if (isSerialized(value)) {
        const serialized = PHPUnserialize.unserialize(value)
        if (key) {
            return serialized[key]
        }
        return serialized
    }

    return value as unknown as T
}
