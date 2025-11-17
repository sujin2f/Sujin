import sanitize from 'mongo-sanitize'
import { Types } from 'mongoose'
/* Models */
import { Recipe } from '@src/schema/recipe'
import Logger from '@src/utils/logger'
/* T_Types */
import type { T_Recipe } from '@sujin/lib/types'
/* Utils */
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'
/* CONSTANTS */
import { COLLECTION } from '@sujin/lib/constants'

export const recipe = async (__id: string): Promise<T_Recipe> => {
    const _id = new Types.ObjectId(sanitize(__id))
    const request = async (_id: Types.ObjectId) =>
        await Recipe.findOne<T_Recipe>({
            _id: new Types.ObjectId(_id),
        })
    const cached = cachedRequest(request, getCacheKey(COLLECTION.RECIPE, __id))

    const result = await cached(_id)
    if (!result) throw new Error()
    Logger.info('🤟 recipe query has been finished')
    return result
}
