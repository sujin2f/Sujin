import sanitize from 'mongo-sanitize'
import { Types } from 'mongoose'
/* Models */
import { Recipe } from '@src/schema/recipe'
import { Logger } from '@sujin/share/model/Logger'
/* T_Types */
import type { T_Recipe, T_UserSub, WithNumPages } from '@sujin/lib/types'
import type { Nullable } from '@sujin/share/types'
/* Utils */
import { verifyAccessToken } from '@src/utils/security'
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'
/* CONSTANTS */
import { COLLECTION, PER_PAGE } from '@sujin/lib/constants'

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
        const payload = await verifyAccessToken(token)
        if (!payload || !payload.sub || !payload.sub._id) throw new Error()
        user = payload.sub
    }

    const userId = user ? user._id : ''
    const page = sanitize(_page)
    const doc = userId ? { user: new Types.ObjectId(userId) } : {}
    const request = async () => {
        return await Recipe.find<T_Recipe>(doc)
            .sort({ created: -1 })
            .skip(PER_PAGE * (page - 1))
            .limit(PER_PAGE)
    }

    const cached = cachedRequest(request, getCacheKey(COLLECTION.RECIPE, userId, page))

    const result = await cached()
    const total = await Recipe.countDocuments(doc)
    Logger.info('🤟 recipes query has been finished')
    return { items: result, numPages: Math.ceil(total / PER_PAGE) }
}
