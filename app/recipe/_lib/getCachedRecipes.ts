import sanitize from 'mongo-sanitize'
import type { ObjectId } from 'mongodb'
/* Models */
import { NoContentError } from '@common/model/Error'
/* T_Types */
import type { T_Mongo, T_Stringify } from '@common/types/mongo'
/* CONSTANTS */
import { COLLECTION, type PropWithPages, type T_Recipe } from '@app/_lib/types'
import { PER_PAGE } from '@app/_lib/data/mysql/constants'
/* Utils */
import { findWithCount } from '@common/data/mongo/mongo'
import { cachedRequest } from '@app/_lib/utils/cache'

/**
 *
 * @param page
 * @param user
 * @returns {PropWithPages<T_Stringify<T_Recipe>>}
 * @throws {NoContentError}
 */
export const getCachedRecipes = async (_page: number, user?: ObjectId) => {
    const page = sanitize(_page)
    let error: Error | null = null
    const recipes = await cachedRequest(
        COLLECTION.RECIPE,
        [user?.toString(), page],
        async () => {
            const doc = user ? { user } : {}

            const { find, count } = await findWithCount<T_Mongo<T_Recipe>>(
                COLLECTION.RECIPE,
                doc,
            )
            const list = await find
                .skip(PER_PAGE * (page - 1))
                .limit(PER_PAGE)
                .project<T_Stringify<T_Recipe>>({
                    search: 0,
                })
                .map((recipe) => ({
                    ...recipe,
                    _id: recipe._id.toString(),
                    user: recipe.user.toString(),
                }))
                .toArray()

            // Failed to find the post, cache false
            if (!list.length) {
                error = new NoContentError(
                    'Recipes cannot be found.',
                    page,
                    user?.toString(),
                )
                return false
            }

            return {
                list,
                pages: Math.ceil(count / PER_PAGE),
            } satisfies PropWithPages<T_Stringify<T_Recipe>>
        },
    )
    if (error) {
        throw error
    }

    return recipes as PropWithPages<T_Stringify<T_Recipe>>
}
