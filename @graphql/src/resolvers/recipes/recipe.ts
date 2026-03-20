import sanitize from 'mongo-sanitize'
import { Types } from 'mongoose'
/* Models */
import { Recipe } from '@src/schema/recipe'
import { Logger } from '@common/model/Logger'
/* T_Types */
import type { T_Recipe } from '@common/types'
/* CONSTANTS */
import { COLLECTION } from '@common/constants'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
/* Utils */
import { setCache } from '@src/utils/redis/cache'

/**
 * Fetch a single recipe by id.
 *
 * This resolver accepts a string id, sanitizes it, converts it to a
 * `Types.ObjectId` and loads the recipe document from MongoDB.
 *
 * Throws a generic `Error` when the recipe is not found (calling code
 * expects this behaviour and higher-level resolvers may convert it to a
 * GraphQL error).
 *
 * @param __id - The recipe id as a string.
 * @returns The `T_Recipe` document.
 */
export const recipe = async (__id: string): Promise<T_Recipe> => {
    const _id = new Types.ObjectId(sanitize(__id))
    const result = await Recipe.findOne<T_Recipe>({
        _id: new Types.ObjectId(_id),
    })
    if (!result) throw new Error('Recipe not found')
    setCache(JSON.stringify(result), `${COLLECTION.RECIPE}-${__id}`, WEEK_IN_SECONDS)
    Logger.info('🤞 recipe query has been finished')
    return result
}
