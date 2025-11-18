import sanitize from 'mongo-sanitize'
import { Types } from 'mongoose'
/* Models */
import { Recipe } from '@src/schema/recipe'
import Logger from '@src/utils/logger'
import Cached from '@sujin/node-cache'
/* Utils */
import { getCacheKey } from '@sujin/lib/utils/cache'
import { verifyToken } from '@src/utils/security'
import { recipe as getRecipe } from '@src/resolvers/recipes/recipe'
/* CONSTANTS */
import { COLLECTION } from '@sujin/lib/constants'

export const removeRecipe = async (
    __id: string,
    token: string,
): Promise<string[]> => {
    // Verify Token
    const user = await verifyToken(token)
    if (!user || !user._id) throw new Error() // TODO expired?

    // Verify Owner
    const _id = sanitize(__id)
    const recipe = await getRecipe(_id)
    if (recipe.user.toString() !== user._id)
        throw new Error('The recipe you are trying to remove is not yours.')

    await Recipe.deleteOne({ _id: new Types.ObjectId(_id) })
    await Cached.getInstance().flush(getCacheKey(COLLECTION.RECIPE))
    Logger.info('🤟 recipe removal has been finished')
    return []
}
