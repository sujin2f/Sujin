import { MySQLQuery } from '@constants/mysql-query'
import { Nullable } from '@project/types/common'
import { OptionValue } from '@project/types/wordpress'
import { MySQL } from '@utils/mysql/mysqld'
import { unserialize } from '@utils/wordpress'

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
