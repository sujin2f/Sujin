/* Models */
import { select } from '@src/utils/mysql'
/* CONSTANTS */
import { WPQuery } from '@src/utils/mysql/wp-query'

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
