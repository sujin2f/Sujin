'use server'

import { MySQLQuery } from '@src/constants/mysql-query'
import { MySQL } from '@src/db/mysql'

export const removeOption = async (key: string): Promise<void> => {
    await MySQL.getInstance().update(MySQLQuery.deleteOption(key))
}
