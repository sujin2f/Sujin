import Mongo from '@common/data/mongo/mongo'
import { getCachedData } from '@src/db/mongo/object-cache'
import { request as getFlickrAPI } from '@src/db/fetch/getFlickr'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import { FlickrImage } from '@src/types/flickr'

/**
 * Requests flickr.com and save
 *
 * @returns {Promise<void>}
 */
const requestAPI = async (): Promise<void> => {
    const flickrs = await getFlickrAPI()
    if (!flickrs.length) {
        return
    }
    await Mongo.deleteMany('flickr', {})
    await Mongo.insertMany('flickr', flickrs)
}

export const getFlickr = async () =>
    await getCachedData<FlickrImage>('flickr', {}, requestAPI, WEEK_IN_SECONDS)
