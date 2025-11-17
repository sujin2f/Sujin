/* Models */
import { Recipe } from '@src/schema/recipe'
import { Types } from 'mongoose'
import Logger from '@src/utils/logger'
/* T_Types */
import type { T_Recipe } from '@sujin/lib/types'
/* Utils */
import { verifyToken } from '@src/utils/security'
import { getCacheKey } from '@sujin/lib/utils/cache'
/* Models */
import Cached from '@sujin/node-cache'
/* CONSTANTS */
import { COLLECTION } from '@sujin/lib/constants'

export const updateRecipe = async (
    _recipe: T_Recipe,
    token: string,
): Promise<string> => {
    // Verify Token
    const user = await verifyToken(token)
    if (!user || !user._id) throw new Error()

    if (!_recipe._id) throw new Error()

    // Verify email matches
    const recipe = await Recipe.findOne<T_Recipe>({
        _id: new Types.ObjectId(_recipe._id),
    })
    if (!recipe) {
        throw new Error()
    }
    if (recipe.user.toString() !== user._id) {
        throw new Error()
    }

    const search = new Set([
        _recipe.title,
        ..._recipe.ingredients.map((item) => item.title),
    ])

    await Recipe.replaceOne(
        { _id: new Types.ObjectId(_recipe._id) },
        { _recipe, search },
    )
    await Cached.getInstance().flush(getCacheKey(COLLECTION.RECIPE))
    Logger.info('🤟 updateRecipe mutation has been finished')
    return _recipe._id.toString()
}
