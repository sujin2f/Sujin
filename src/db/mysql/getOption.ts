'use server'
/* Models */
import MySQL from '@src/db/mysql'
/* Constants */
import { MySQLQuery } from '@src/constants/mysql-query'

type Option = { option_value: string }

/**
 * Retrieves an option value from the database.
 * @param {string} key - The key of the option to retrieve.
 * @returns {Promise<string>} The value of the option.
 */
export const getOption = async (key: string): Promise<string> =>
    await MySQL.getInstance()
        .selectOne<Option>(MySQLQuery.getOption(key))
        .then((option) => option.option_value)
        .catch(() => '')

export default getOption
