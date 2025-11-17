import sanitize from 'mongo-sanitize'
/* Models */
import Logger from '@src/utils/logger'
import Cached from '@sujin/node-cache'
/* CONSTANTS */
import { GQL_QUERY_TYPE, COLLECTION } from '@sujin/lib/constants'
/* Utils */
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'
import { verifyAdmin } from '@src/utils/mongo/security'
import { mysqlDisconnect } from '@src/utils/mysql'
import { convertWPImageURL } from '@src/utils/mongo/convertWPImageURL'
/* T_Types */
import type { Context } from '@src/types'
import type { T_Background } from '@sujin/lib/types'
import { Background } from '@src/schema/background'
import { getBackgrounds } from '@src/utils/mysql/media'

/**
 * Get backgrounds
 *
 * @returns {Promise<T_Background[]>}
 */
export const background = async (
    _query: GQL_QUERY_TYPE,
    context: Context,
): Promise<T_Background[]> => {
    const query = sanitize(_query)

    if (query === GQL_QUERY_TYPE.QUERY) {
        const result = await (context.token
            ? getList(context.token)
            : getCachedList())
        Logger.info(`🤟 backgrounds query done`)
        return result
    }

    if (query === GQL_QUERY_TYPE.UPDATE) {
        const result = await update(context.token)
        Logger.info(`🤟 backgrounds update done`)
        return result
    }

    Logger.error(`🤟 query has been called with nothing`)
    throw new Error()
}

/**
 * Get backgrounds
 * This returns the cached result if it exists
 *
 * @returns {Promise<T_Background[]>} - The background array
 */
const getCachedList = async (): Promise<T_Background[]> => {
    const request = cachedRequest(
        queryList,
        getCacheKey(COLLECTION.BACKGROUNDS),
    )
    const result = await request()
    return result
}

/**
 * Get backgrounds
 * This returns the cached result if it exists
 *
 * @returns {Promise<T_Background[]>} - The background array
 */
const getList = async (token: string): Promise<T_Background[]> => {
    verifyAdmin(
        token,
        'background list query has been called by non admin user',
    )
    return await queryList()
}

const queryList = async (): Promise<T_Background[]> => {
    return await Background.aggregate<T_Background>([{ $sample: { size: 10 } }])
}

const update = async (token: string): Promise<[]> => {
    verifyAdmin(
        token,
        'background update query has been called by non admin user',
    )
    Cached.getInstance().flush(getCacheKey(COLLECTION.BACKGROUNDS))
    await getBackgrounds().then(async (result) => {
        const backgrounds = result.map((image) => convertWPImageURL(image))
        await Background.deleteMany({})
        await Background.insertMany(backgrounds)
    })
    await mysqlDisconnect()
    return []
}
