/* Models */
import Cached from '@sujin/common/model/Cached'
/* CONSTANTS */
import { COLLECTION } from '@sujin/lib/types'
/* Utils */
import { getCacheKey } from '@sujin/lib/utils/cache'
import { getBackgrounds } from '@src/utils/mysql/getBackgrounds'

/* T_Types */
import type { MutationResultType } from '@src/types'
import { convertImageBlockURL } from '@src/utils/mongo/convertImageBlockURL'
import { Background } from '@src/schema/background'

/**
 * Update backgrounds from MySQL
 * @returns {Promise<T_Background[]>} - The background array
 * @throws
 */
export const updateBackgrounds = async (): Promise<void> => {
    Cached.getInstance().flush(getCacheKey(COLLECTION.BACKGROUNDS))
    await getBackgrounds().then(async (result) => {
        const backgrounds = result.map((image) => convertImageBlockURL(image))
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
