import sanitize from 'mongo-sanitize'
/* Models */
import Cached from '@sujin/common/model/Cached'
import { UnauthorizedError } from '@sujin/common/model/Error'
/* Utils */
import { isAdmin } from '../../../../.backup/api/auth/_lib/utils-server'
import { getCacheKey } from '@sujin/lib/utils/cache'
import { cachedRequest } from '@app/_lib/utils/cache'
/* T_Types */
import { COLLECTION } from '@app/_lib/types'
import { findOne, insertOrReplace } from '@sujin/common/data/mongo/mongo'

/**
 * Get site-wide system options.
 *
 * @param {string} _key - The key of the option.
 * @returns {Promise<string>} Value
 */
export const getCachedOption = async (_key: string): Promise<string> => {
    const key = sanitize(_key)
    const request = cachedRequest(
        async (key: string) =>
            await findOne(COLLECTION.OPTIONS, { key }).then(
                (result) => result.value,
            ),
        getCacheKey(COLLECTION.OPTIONS, 'key'),
    )
    return await request(key)
}

/**
 * Set site-wide system options.
 *
 * @param {string} _key - The key of the option.
 * @param {string} _value - The value of the option.
 */
export const setOption = async (_key: string, _value: string) => {
    const key = sanitize(_key)
    const value = sanitize(_value)

    if (!(await isAdmin())) throw new UnauthorizedError()

    await Cached.getInstance().flush(getCacheKey(COLLECTION.OPTIONS, key))
    return await insertOrReplace(COLLECTION.OPTIONS, { key }, { key, value })
}
