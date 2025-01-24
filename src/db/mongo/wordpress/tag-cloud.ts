import Mongo from '@common/data/mongo/mongo'
import { getCachedData } from '@src/db/mongo/object-cache'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import { getTagCloud as queryTagCloud } from '@src/db/mysql/getTagCloud'
import type { TagCloud } from '@src/types/wordpress'
import type { WithId } from 'mongodb'

/**
 * Requests MySQL and save
 *
 * @returns {Promise<WithId<TagCloud>[]>}
 */
const requestAPI = async (): Promise<WithId<TagCloud>[]> => {
    const tagCloud = await queryTagCloud()
    if (!tagCloud.length) {
        return []
    }
    await Mongo.deleteMany('tag-cloud', {})
    await Mongo.insertMany('tag-cloud', tagCloud)
    return await Mongo.findMany('tag-cloud', {})
}

export const getTagCloud = async () =>
    await getCachedData<TagCloud>('tag-cloud', {}, requestAPI, WEEK_IN_SECONDS)
