/* Models */
import { Recipe } from '@src/schema/recipe'
import { Types } from 'mongoose'
import { Logger } from '@common/model/Logger'
/* T_Types */
import type { T_Recipe } from '@common/types'
/* Utils */
import { removeCache } from '@src/utils/redis/cache'
import { verifyAccessToken } from '@src/utils/security'
/* CONSTANTS */
import { COLLECTION } from '@common/constants'

/**
 * Create a new recipe document for the authenticated user.
 *
 * - Verifies the provided GraphQL token and associates the new recipe with
 *   the user's ObjectId.
 * - Builds a `search` string from the recipe title and ingredients.
 * - Clears the recipes cache after insertion.
 *
 * @param   {T_Recipe} recipe The recipe payload to insert.
 * @param   {string}   token  Access token.
 * @returns {string}          The newly-created recipe `_id` as a string.
 * @throws  {Error}           When the token is invalid or missing.
 */
export const createRecipe = async (recipe: T_Recipe, token: string): Promise<string> => {
    // Verify Token
    const user = await verifyAccessToken(token)
    if (!user._id) throw new Error()

    const search = new Set([recipe.title, ...recipe.ingredients.map((item) => item.title)])

    const result = await Recipe.insertOne({
        ...recipe,
        user: new Types.ObjectId(user._id),
        search: Array.from(search).join(' '),
    })
    Logger.info('🤞 recipe mutation has been finished')
    // TODO store recipe list as individual recipes
    await removeCache(COLLECTION.RECIPE) // TODO when the return type of endpoint is recipe, remove list, _id, and mine
    return result._id.toString()
}
