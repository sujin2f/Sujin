import Mongo from '@common/data/mongo/mongo'
import { getCachedData } from '@src/db/mongo/object-cache'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import { getTagCloud as queryTagCloud } from '@src/db/mysql/getTagCloud'
import type { TagCloud } from '@src/types/wordpress'

/**
 * Requests MySQL and save
 *
 * @returns {Promise<void>}
 */
const requestAPI = async (): Promise<void> => {
    const tagCloud = await queryTagCloud()
    if (!tagCloud.length) {
        return
    }
    await Mongo.deleteMany('tag-cloud', {})
    await Mongo.insertMany('tag-cloud', tagCloud)
}

export const getTagCloud = async () =>
    await getCachedData<TagCloud>('tag-cloud', {}, requestAPI, WEEK_IN_SECONDS)
