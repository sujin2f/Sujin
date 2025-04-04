'use server'
/* Models */
import MySQL from '@app/helpers/data/mysql'
/* Constants */
import { MySQLQuery } from '@app/helpers/constants/mysql-query'
/* Type */
import type { OptionType } from '@app/helpers/types/wordpress'

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
