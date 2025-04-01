import { type WithId } from 'mongodb'
/* Models */
import Cached from '@common/model/Cached'
import Mongo from '@common/data/mongo/mongo'
/* Constants */
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import { IS_DEV, VERSION } from '@common/constants/helper'
/* Types */
import type { Image } from '@src/types/wordpress'

/**
 * Get backgrounds from MongoDB
 * @returns {Promise<WithId<Image>[]>} - The background array
 */
const request = async (): Promise<WithId<Image>[]> =>
    await Mongo.findMany<Image>('backgrounds', {})

/**
 * Get backgrounds
 * This returns the cached result if it exists
 * @returns {Promise<WithId<Image>[]>} - The background array
 */
const getBackgrounds = async (): Promise<WithId<Image>[]> =>
    await Cached.getInstance().getOrExecute(
        `backgrounds-${VERSION}`,
        async () => await request(),
        WEEK_IN_SECONDS,
        IS_DEV,
    )

export default getBackgrounds
