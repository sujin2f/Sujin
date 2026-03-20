import sanitize from 'mongo-sanitize'
import { Types } from 'mongoose'
/* Models */
import { Recipe } from '@src/schema/recipe'
import { Logger } from '@common/model/Logger'
/* T_Types */
import type { T_Recipe, T_UserSub, WithNumPages } from '@common/types'
import type { Nullable } from '@common/types'
/* Utils */
import { verifyAccessToken } from '@src/utils/security'
import { setCache } from '@src/utils/redis/cache'
/* CONSTANTS */
import { COLLECTION, PER_PAGE } from '@common/constants'
import { MINUTE_IN_SECONDS } from '@common/constants/datetime'

/**
 * Fetch a paginated list of recipes.
 *
 * If `mine` is true the `token` is verified and only recipes created by the
 * authenticated user are returned.
 *
 * @param   {number}  _page          Page number (1-based).
 * @param   {boolean} mine           When true, restrict results to the calling user.
 * @param   {token}   token          Access token.
 * @returns {WithNumPages<T_Recipe>} An object with `items` (recipes) and `numPages` for pagination.
 */
export const recipes = async (_page: number, mine: boolean, token: string): Promise<WithNumPages<T_Recipe>> => {
    if (mine && !token) {
        throw new Error()
    }
    let user: Nullable<T_UserSub>
    if (mine) {
        user = await verifyAccessToken(token)
        if (!user._id) throw new Error()
    }

    const userId = user ? user._id : ''
    const page = sanitize(_page)
    const doc = userId ? { user: new Types.ObjectId(userId) } : {}
    const items = await Recipe.find<T_Recipe>(doc)
        .sort({ created: -1 })
        .skip(PER_PAGE * (page - 1))
        .limit(PER_PAGE)
    const total = await Recipe.countDocuments(doc)
    const result = { items, numPages: Math.ceil(total / PER_PAGE) }
    setCache(JSON.stringify(result), `${COLLECTION.RECIPE}-${mine ? userId : 'list'}-${_page}`, 30 * MINUTE_IN_SECONDS)
    Logger.info(`⭐️ recipes query has been finished ${userId} ${page}`)
    return result
}
