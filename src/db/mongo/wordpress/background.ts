import Mongo from '@common/data/mongo/mongo'
import { getCachedData } from '@src/db/mongo/object-cache'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import { getBackgrounds as queryBackgrounds } from '@src/db/mysql/getBackgrounds'
import type { Image } from '@src/types/wordpress'
import type { WithId } from 'mongodb'

/**
 * Requests MySQL and save
 *
 * @returns {Promise<void>}
 */
const requestAPI = async (): Promise<WithId<Image>[]> => {
    const backgrounds = await queryBackgrounds()
    if (!backgrounds.length) {
        return []
    }
    await Mongo.deleteMany('backgrounds', {})
    await Mongo.insertMany('backgrounds', backgrounds)
    return await Mongo.findMany('backgrounds', {})
}

export const getBackgrounds = async () =>
    await getCachedData<Image>('backgrounds', {}, requestAPI, WEEK_IN_SECONDS)
