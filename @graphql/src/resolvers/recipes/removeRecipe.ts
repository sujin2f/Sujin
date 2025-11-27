import sanitize from 'mongo-sanitize'
import { Types } from 'mongoose'
/* Models */
import { Recipe } from '@src/schema/recipe'
import { Logger } from '@sujin/share/model/Logger'
import Cached from '@sujin/share/model/Cache'
/* Utils */
import { getCacheKey } from '@sujin/lib/utils/cache'
import { verifyAccessToken } from '@src/utils/security'
import { recipe as getRecipe } from '@src/resolvers/recipes/recipe'
/* CONSTANTS */
import { COLLECTION } from '@sujin/lib/constants'

/**
 * Remove a recipe owned by the authenticated user.
 *
 * - Verifies the token, ensures the recipe belongs to the caller, deletes
 *   the recipe and flushes the recipe cache.
 *
 * @param   {string} __id  The recipe id to remove.
 * @param   {string} token Access token.
 * @returns {string[]}     An empty array on success.
 * @throws  {Error}        When verification fails or the caller is not the owner.
 */
export const removeRecipe = async (__id: string, token: string): Promise<string[]> => {
    // Verify Token
    const user = await verifyAccessToken(token)
    if (!user._id) throw new Error()

    // Verify Owner
    const _id = sanitize(__id)
    const recipe = await getRecipe(_id)
    if (recipe.user.toString() !== user._id) throw new Error('The recipe you are trying to remove is not yours.')

    await Recipe.deleteOne({ _id: new Types.ObjectId(_id) })
    await Cached.getInstance().flush(getCacheKey(COLLECTION.RECIPE))
    Logger.info('🤟 recipe removal has been finished')
    return []
}
