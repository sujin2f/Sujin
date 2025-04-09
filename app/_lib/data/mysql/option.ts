'use server'
/* Models */
import MySQL from '@app/_lib/data/mysql'
/* CONSTANTS */
import { MySQLQuery } from '@app/_lib/data/mysql/constants'

type T_Option = { option_value: string }

/**
 * Retrieves an option value from the database.
 *
 * @param {string} key - The key of the option to retrieve.
 * @returns {Promise<string>} The value of the option.
 */
export const getOption = async (key: string): Promise<string> =>
    await MySQL.getInstance()
        .selectOne<T_Option>(MySQLQuery.getOption(key))
        .then((option) => option.option_value)

export const removeOption = async (key: string): Promise<void> =>
    await MySQL.getInstance().update(MySQLQuery.deleteOption(key))
