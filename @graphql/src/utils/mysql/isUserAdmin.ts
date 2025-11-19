/* Models */
import { select } from '@src/utils/mysql'
/* CONSTANTS */
import { WPQuery } from '@src/utils/mysql/wp-query'

/**
 * Check whether a WordPress user (by email) has the `administrator` capability.
 *
 * Executes a MySQL query that selects the user's capabilities and inspects the
 * returned value for the `administrator` string. Returns `false` on any error
 * or if the user is not found.
 *
 * @param email - User email to check.
 * @returns `true` if the user is an administrator, otherwise `false`.
 */
export const isUserAdmin = async (email: string): Promise<boolean> => {
    return await select<string>(WPQuery.isUserAdmin(email))
        .then((value: string[]) => {
            if (!value || !value.length) {
                return false
            }
            if (JSON.stringify(value).includes('administrator')) {
                return true
            }
            return false
        })
        .catch(() => false)
}
