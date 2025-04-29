import { ObjectId } from 'mongodb'
/* Models */
import { A_Error, NoContentError } from '@common/model/Error'
/* T_Types */
import type { T_Mongo, T_Stringify } from '@common/types/mongo'
/* CONSTANTS */
import { COLLECTION, type T_Recipe } from '@app/_lib/types'
/* Utils */
import { findOne } from '@common/data/mongo/mongo'
import { cachedRequest } from '@app/_lib/utils/cache'

/**
 *
 * @param _id
 * @returns
 * @throws {NoContentError}
 */
export const getCachedRecipe = async (_id: ObjectId) => {
    let error: Error | null = null
    const recipe = await cachedRequest<T_Stringify<T_Recipe> | false>(
        COLLECTION.RECIPE,
        [_id.toString()],
        async () =>
            await findOne<T_Mongo<T_Recipe>>(COLLECTION.RECIPE, {
                _id,
            })
                .then((recipe) => ({
                    ...recipe,
                    _id: recipe._id.toString(),
                    user: recipe.user.toString(),
                }))
                .catch((e) => {
                    // Failed to find the post, cache false
                    error =
                        e instanceof A_Error
                            ? new NoContentError(
                                  'Recipe cannot be found.',
                                  _id.toString(),
                              ).setCause(e)
                            : e
                    return false
                }),
    )
    if (error) {
        throw error
    }
    return recipe as T_Stringify<T_Recipe>
}
