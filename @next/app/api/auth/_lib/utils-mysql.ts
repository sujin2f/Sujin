'use server'
/* Models */
import { select, update } from '@sujin/common/data/mysql'
import { ForbiddenError } from '@sujin/common/model/Error'
/* CONSTANTS */
import { MySQLQuery } from '@app/_lib/utils/mysql/constants'
/* Utils */
import { isAdmin } from '@app/api/auth/_lib/utils-server'

/**
 * User admin and WP nonce allow to access
 *
 * @param {string} nonce
 * @param {string} slug
 * @returns {Promise<void>}
 * @throws {ForbiddenError} Failed to access
 */
export const auth = async (nonce?: string, slug?: string): Promise<void> => {
    const admin = await isAdmin()
    if (admin) return

    // Nonce validation
    if (!nonce) {
        throw new ForbiddenError('invalid nonce')
    }
    const optionKey = ['mutate', slug, nonce].join('_')
    await getOption(optionKey).catch(() => {
        throw new ForbiddenError(`Failed to get MySQL option: ${optionKey}`)
    })
    await removeOption(optionKey)
}

type T_Option = { option_value: string }

/**
 * Retrieves an option value from the database.
 *
 * @param {string} key - The key of the option to retrieve.
 * @returns {Promise<string>} The value of the option.
 */
const getOption = async (key: string): Promise<string> =>
    await select<T_Option>(MySQLQuery.getOption(key)).then(
        (option) => option[0].option_value,
    )

const removeOption = async (key: string): Promise<void> =>
    await update(MySQLQuery.deleteOption(key))
