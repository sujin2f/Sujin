import { revalidateTag } from 'next/cache'
import type { ObjectId } from 'mongodb'
/* Models */
import Cached from '@common/model/Cached'
import { UnauthorizedError } from '@common/model/Error'
/* CONSTANTS */
import { COLLECTION } from '@app/_lib/types'
/* Utils */
import { getCacheKey } from '@app/_lib/utils/cache'
import { deleteOne, findOne, getCollection } from '@common/data/mongo/mongo'
import { getCurrentUser } from '@app/_lib/data/mongo/user'

export const deleteRecipe = async (_id: ObjectId) => {
    const collection = await getCollection(COLLECTION.RECIPE)
    const userId = await getCurrentUser()
        .then((user) => user._id)
        .catch((e) => {
            if (e instanceof UnauthorizedError) {
                throw new UnauthorizedError('You need to ').setCause(e)
            }
            throw e
        })
    const recipe = await findOne(collection, { _id })

    if (recipe.user.toString() !== userId) {
        throw new UnauthorizedError(
            `Not Authorized in deleteRecipe() for ${recipe._id} ${recipe.user}`,
        )
    }

    await deleteOne(collection, { _id })
    await Cached.getInstance().flush(
        getCacheKey(COLLECTION.RECIPE, userId.toString()),
    )
    revalidateTag('recipe')
}
