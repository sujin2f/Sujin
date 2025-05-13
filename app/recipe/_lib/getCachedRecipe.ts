import { unstable_cache } from 'next/cache'
import { ObjectId } from 'mongodb'
/* T_Types */
import type { T_Mongo } from '@common/types/mongo'
/* CONSTANTS */
import { COLLECTION, type T_Recipe } from '@app/_lib/types'
import { VERSION } from '@common/constants/helper'
import { revalidate } from '@app/_lib/constants'
/* Utils */
import { findOne } from '@common/data/mongo/mongo'
import { cachedRequest, getCacheKey } from '@app/_lib/utils/cache'

const query = async (_id: ObjectId) =>
    await findOne<T_Mongo<T_Recipe>>(COLLECTION.RECIPE, {
        _id,
    })

const cached = async (_id: ObjectId) => {
    const request = cachedRequest(
        query,
        getCacheKey(COLLECTION.RECIPE, _id.toString()),
    )
    return await request(_id)
}

export const getCachedRecipe = async (id: ObjectId) => {
    'use server'
    const request = unstable_cache(cached, [id.toString(), VERSION], {
        tags: ['recipe', 'single'],
        revalidate,
    })
    return await request(id)
}
