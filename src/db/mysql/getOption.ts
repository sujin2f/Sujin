'use server'

import { MySQLQuery } from '@src/constants/mysql-query'
import { Nullable } from '@common/types'
import { MySQL } from '@src/db/mysql'

type Option = { option_value: string }

export const getOption = async (key: string): Promise<Nullable<Option>> => {
    return await MySQL.getInstance().selectOne<Option>(
        MySQLQuery.getOption(key),
    )
}
