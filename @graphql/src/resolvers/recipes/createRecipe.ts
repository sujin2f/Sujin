/* Models */
import { Recipe } from '@src/schema/recipe'
import { Types } from 'mongoose'
import { Logger } from '@sujin/share/model/Logger'
/* T_Types */
import type { T_Recipe } from '@sujin/lib/types'
/* Utils */
import { verifyToken } from '@src/utils/security'
import { getCacheKey } from '@sujin/lib/utils/cache'
/* Models */
import Cached from '@sujin/share/model/Cache'
/* CONSTANTS */
import { COLLECTION } from '@sujin/lib/constants'

/**
 * Create a new recipe document for the authenticated user.
 *
 * - Verifies the provided GraphQL token and associates the new recipe with
 *   the user's ObjectId.
 * - Builds a `search` string from the recipe title and ingredients.
 * - Clears the recipes cache after insertion.
 *
 * @param recipe - The recipe payload to insert.
 * @param token - GraphQL JWT identifying the creating user.
 * @returns The newly-created recipe `_id` as a string.
 * @throws {Error} When the token is invalid or missing.
 */
export const createRecipe = async (recipe: T_Recipe, _token: string): Promise<string> => {
    // Verify Token
    const token = verifyToken(_token)
    if (!token || !token.sub || !token.sub._id) throw new Error()

    const search = new Set([recipe.title, ...recipe.ingredients.map((item) => item.title)])

    const result = await Recipe.insertOne({
        ...recipe,
        user: new Types.ObjectId(token.sub._id),
        search: Array.from(search).join(' '),
    })
    await Cached.getInstance().flush(getCacheKey(COLLECTION.RECIPE))
    Logger.info('🤟 recipe mutation has been finished')
    return result._id.toString()
}
