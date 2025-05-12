'use server'
import { revalidateTag } from 'next/cache'
import { ObjectId } from 'mongodb'
/* Models */
import Cached from '@common/model/Cached'
import { A_Error, ForbiddenError } from '@common/model/Error'
/* CONSTANTS */
import { COLLECTION } from '@app/_lib/types'
/* Utils */
import { getCacheKey } from '@app/_lib/utils/cache'
import { deleteOne, findOne, getCollection } from '@common/data/mongo/mongo'
import { getCurrentUser } from '@app/api/auth/_lib/utils-server'
import Logger from '@common/model/Logger'

export const deleteRecipe = async (id: string) => {
    const _id = new ObjectId(id)
    const collection = await getCollection(COLLECTION.RECIPE)
    const userId = await getCurrentUser().then((user) => {
        if (!user) {
            throw new ForbiddenError(
                'You need to log in for adding or modifying a recipe.',
            )
        }
        return user._id
    })
    const recipe = await findOne(collection, { _id }).catch((e) => {
        if (e instanceof A_Error) {
            e.log()
        } else {
            Logger.server(e)
        }
        throw e
    })

    if (recipe.user.toString() !== userId) {
        throw new ForbiddenError(
            `Not Authorized in deleteRecipe() for ${_id.toString()} ${
                recipe.user
            }`,
        )
    }

    await deleteOne(collection, { _id }).catch((e) => {
        Logger.server(e)
        throw e
    })
    await Cached.getInstance().flush(getCacheKey(COLLECTION.RECIPE))
    revalidateTag('recipe')
}
