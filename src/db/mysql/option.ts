'use server'
/* Models */
import MySQL from '@src/db/mysql'
/* Constants */
import { MySQLQuery } from '@src/constants/mysql-query'
/* Type */
import type { OptionType } from '@src/types/wordpress'

/**
 * Retrieves an option value from the database.
 *
 * @param {string} key - The key of the option to retrieve.
 * @returns {Promise<string>} The value of the option.
 */
export const getOption = async (key: string): Promise<string> =>
    await MySQL.getInstance()
        .selectOne<OptionType>(MySQLQuery.getOption(key))
        .then((option) => option.option_value)
        .catch(() => '')

export const removeOption = async (key: string): Promise<void> =>
    await MySQL.getInstance().update(MySQLQuery.deleteOption(key))
