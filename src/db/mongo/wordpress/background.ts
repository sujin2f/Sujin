import Mongo from '@common/data/mongo-connect'
import { getCachedData } from '@src/db/mongo/object-cache'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import { getBackgrounds as queryBackgrounds } from '@src/db/mysql/getBackgrounds'
import type { Image } from '@src/types/wordpress'

/**
 * Requests MySQL and save
 *
 * @returns {Promise<void>}
 */
const requestAPI = async (): Promise<void> => {
    const backgrounds = await queryBackgrounds()

    if (!backgrounds.length) {
        return
    }
    await Mongo.deleteMany('backgrounds', {})
    await Mongo.insertMany('backgrounds', backgrounds)
}

export const getBackgrounds = async () =>
    await getCachedData<Image>('backgrounds', {}, requestAPI, WEEK_IN_SECONDS)
