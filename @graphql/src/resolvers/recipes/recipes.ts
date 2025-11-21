import sanitize from 'mongo-sanitize'
import { Types } from 'mongoose'
/* Models */
import { Recipe } from '@src/schema/recipe'
import { Logger } from '@sujin/share/model/Logger'
/* T_Types */
import type { T_Recipe, T_UserSub, WithNumPages } from '@sujin/lib/types'
import type { Nullable } from '@sujin/share/types'
/* Utils */
import { verifyToken } from '@src/utils/security'
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'
/* CONSTANTS */
import { COLLECTION, PER_PAGE } from '@sujin/lib/constants'

/**
 * Fetch a paginated list of recipes.
 *
 * If `mine` is true the `token` is verified and only recipes created by the
 * authenticated user are returned.
 *
 * @param _page - Page number (1-based).
 * @param mine - When true, restrict results to the calling user.
 * @param token - GraphQL JWT used to identify the current user (when `mine` is true).
 * @returns An object with `items` (recipes) and `numPages` for pagination.
 */
export const recipes = async (_page: number, mine: boolean, _token: string): Promise<WithNumPages<T_Recipe>> => {
    if (mine && !_token) {
        throw new Error()
    }
    let user: Nullable<T_UserSub>
    if (mine) {
        const token = verifyToken(_token)
        if (!token || !token.sub || !token.sub._id) throw new Error()
        user = token.sub
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
