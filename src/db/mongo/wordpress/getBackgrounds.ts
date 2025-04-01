/* Models */
import Cached from '@common/model/Cached'
import Mongo from '@common/data/mongo/mongo'
/* Constants */
import { DAY_IN_SECONDS } from '@common/constants/datetime'
import { IS_DEV, VERSION } from '@common/constants/helper'
/* Types */
import type { Image } from '@src/types/wordpress'

/**
 * Get backgrounds from MongoDB
 * @returns {Promise<WithId<Image>[]>} - The background array
 */
const request = async (): Promise<Image[]> =>
    await Mongo.random<Image>('backgrounds', 10)

/**
 * Get backgrounds
 * This returns the cached result if it exists
 * @returns {Promise<Image[]>} - The background array
 */
const getBackgrounds = async (): Promise<Image[]> =>
    await Cached.getInstance().getOrExecute(
        `backgrounds-${VERSION}`,
        async () => await request(),
        DAY_IN_SECONDS,
        IS_DEV,
    )

export default getBackgrounds
