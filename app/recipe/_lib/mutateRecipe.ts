import { revalidateTag } from 'next/cache'
import { ObjectId } from 'mongodb'
/* Models */
import Cached from '@common/model/Cached'
import { UnauthorizedError } from '@common/model/Error'
/* T_Types */
import type { T_Stringify } from '@common/types/mongo'
/* CONSTANTS */
import { COLLECTION, type T_Recipe } from '@app/_lib/types'
/* Utils */
import { getCacheKey } from '@app/_lib/utils/cache'
import { insertOne, updateOne } from '@common/data/mongo/mongo'
import { getCurrentUser } from '@app/_lib/data/mongo/user'

export const mutateRecipe = async (recipe: Partial<T_Stringify<T_Recipe>>) => {
    const userId = await getCurrentUser()
        .then((user) => user._id)
        .catch((e) => {
            if (e instanceof UnauthorizedError) {
                throw new UnauthorizedError('You need to ').setCause(e)
            }
            throw e
        })

    if (recipe._id && recipe.user && recipe.user !== userId) {
        throw new UnauthorizedError(
            `Not Authorized in insertRecipe() for ${recipe._id} ${recipe.user}`,
        )
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, user, ...doc } = recipe
    if (recipe._id) {
        await updateOne(
            COLLECTION.RECIPE,
            { _id: new ObjectId(recipe._id) },
            { $set: doc },
        )
    } else {
        await insertOne(COLLECTION.RECIPE, {
            ...doc,
            user: new ObjectId(user),
        })
    }

    await Cached.getInstance().flush(
        getCacheKey(COLLECTION.RECIPE, userId.toString()),
    )
    revalidateTag('recipe')
}
