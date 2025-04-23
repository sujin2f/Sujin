import type { Filter } from 'mongodb'
/* Models */
import Cached from '@common/model/Cached'
/* T_Types */
import type { T_Mongo } from '@common/types/mongo'
/* CONSTANTS */
import { IS_DEV } from '@common/constants/helper'
import { COLLECTION, PropWithPages, type T_Recipe } from '@app/_lib/types'
import { DAY_IN_SECONDS } from '@common/constants/datetime'
/* Utils */
import { getCacheKey } from '@app/_lib/utils'
import { getCollection } from '@common/data/mongo/mongo'
import { PER_PAGE } from '../mysql/constants'
import { getServerSession } from 'next-auth'
import { authOptions } from '@app/api/auth/constants'
import { getUser } from './user'

export const getCachedRecipe = async (
    my: boolean,
    page: number,
): Promise<PropWithPages<T_Mongo<T_Recipe>>> => {
    const session = await getServerSession(authOptions)
    const userId =
        my &&
        session?.user?.email &&
        (await getUser(session.user.email).then((user) =>
            user ? user._id : null,
        ))

    return await Cached.getInstance().getOrExecute(
        getCacheKey(COLLECTION.RECIPE, userId?.toString()),
        async () => {
            const collection = await getCollection<T_Mongo<T_Recipe>>(
                COLLECTION.RECIPE,
            )
            const doc: Filter<T_Mongo<T_Recipe>> = {}
            if (userId) {
                doc.user = userId
            }
            const total = await collection.countDocuments(doc)
            return {
                list: await collection
                    .find(doc)
                    .skip(PER_PAGE * (page - 1))
                    .limit(PER_PAGE)
                    .toArray(),
                pages: Math.ceil(total / PER_PAGE),
            }
        },
        DAY_IN_SECONDS,
        IS_DEV,
    )
}
