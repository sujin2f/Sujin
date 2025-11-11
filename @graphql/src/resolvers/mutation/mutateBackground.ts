/* Models */
import Cached from '@sujin/node-cache'
/* CONSTANTS */
import { COLLECTION } from '@sujin/lib/types'
/* Utils */
import { getCacheKey } from '@sujin/lib/utils/cache'
import { getBackgrounds } from '@src/utils/mysql/media'

/* T_Types */
import type { MutationResultType } from '@src/types'
import { convertWPImageURL } from '@src/utils/mongo/convertWPImageURL'
import { Background } from '@src/schema/background'

/**
 * Update backgrounds from MySQL
 * @returns {Promise<T_Background[]>} - The background array
 * @throws
 */
export const updateBackgrounds = async (): Promise<void> => {
    Cached.getInstance().flush(getCacheKey(COLLECTION.BACKGROUNDS))
    await getBackgrounds().then(async (result) => {
        const backgrounds = result.map((image) => convertWPImageURL(image))
        await Background.deleteMany({})
        await Background.insertMany(backgrounds)
    })
}

/**
 * Update Mongo Post type from MySQL for GraphQL
 *
 * @param {string} nonce - WP nonce
 * @returns {Promise<MutationResultType>}
 */
export const mutateBackground = async (): Promise<MutationResultType> => {
    await updateBackgrounds()
    return {
        result: true,
    }
}
