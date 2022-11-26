import { MySQLQuery } from 'src/constants/mysql-query'
import { Nullable } from 'src/types/common'
import { OptionValue } from 'src/types/wordpress'
import { MySQL } from 'src/utils/mysql/mysqld'
import { unserialize } from 'src/utils/wordpress'

export const getOption = async <T extends OptionValue>(
    optionName: string,
    defaultValue: T,
    key?: Nullable<string>,
): Promise<Nullable<T>> => {
    const result = await MySQL.getInstance().selectOne<{
        option_value: string
    }>(MySQLQuery.getOption(optionName))

    if (!result) {
        return
    }

    return unserialize<T>(result.option_value, defaultValue, key)
}
