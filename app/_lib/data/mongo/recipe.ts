import { ObjectId, type Filter } from 'mongodb'
import { getServerSession } from 'next-auth'
/* Models */
import Cached from '@common/model/Cached'
/* T_Types */
import type { T_Mongo } from '@common/types/mongo'
/* CONSTANTS */
import { IS_DEV } from '@common/constants/helper'
import { COLLECTION, PropWithPages, type T_Recipe } from '@app/_lib/types'
import { DAY_IN_SECONDS } from '@common/constants/datetime'
import { PER_PAGE } from '@app/_lib/data/mysql/constants'
/* Utils */
import { getCacheKey } from '@app/_lib/utils'
import { findOne, findWithCount, insertOne } from '@common/data/mongo/mongo'
import { authOptions } from '@app/api/auth/constants'
import { getUser } from '@app/_lib/data/mongo/user'

export const getCachedRecipes = async (page: number, userId?: string) => {
    const doc: Filter<T_Mongo<T_Recipe>> = {}

    if (userId) {
        doc.user = new ObjectId(userId)
    }

    return await Cached.getInstance().getOrExecute(
        getCacheKey(COLLECTION.RECIPE, userId, page),
        async () => {
            const { find, count } = await findWithCount<T_Mongo<T_Recipe>>(
                COLLECTION.RECIPE,
                doc,
            )
            const list = await find
                .skip(PER_PAGE * (page - 1))
                .limit(PER_PAGE)
                .project<T_Mongo<Omit<T_Recipe, 'user' | 'recipe'>>>({
                    user: 0,
                    recipe: 0,
                })
                .toArray()

            return {
                list,
                pages: Math.ceil(count / PER_PAGE),
            } satisfies PropWithPages<Partial<T_Recipe>>
        },
        DAY_IN_SECONDS,
        IS_DEV,
    )
}

export const getCachedRecipe = async (_id: ObjectId) => {
    return await Cached.getInstance().getOrExecute(
        getCacheKey(COLLECTION.RECIPE, _id.toString()),
        async () => await findOne<T_Recipe>(COLLECTION.RECIPE, { _id }),
        DAY_IN_SECONDS,
        IS_DEV,
    )
}

export const insertRecipe = async (recipe: Partial<T_Recipe>) => {
    const session = await getServerSession(authOptions)
    const email = session?.user?.email
    if (!email) {
        throw Error('!')
    }

    const userId = await getUser(email).then((user) => (user ? user._id : null))
    if (!userId) {
        throw Error('!')
    }

    await Cached.getInstance().flush(
        getCacheKey(COLLECTION.RECIPE, userId.toString()),
    )

    return await insertOne(COLLECTION.RECIPE, {
        ...recipe,
        user: userId,
    })
}
