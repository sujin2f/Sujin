import type { WithId } from 'mongodb'
/* Models */
import Cached from '@common/model/Cached'
import Mongo from '@common/data/mongo/mongo'
/* Constants */
import { DAY_IN_SECONDS } from '@common/constants/datetime'
import { IS_DEV } from '@common/constants/helper'
import { COLLECTION } from '@app/_lib/data/mongo/constants'
/* Types */
import type { ImageBlockType } from '@app/_lib/data/mysql/types'
/* Utils */
import { getCacheKey } from '@app/_lib/utils'
import Logger from '@common/model/Logger'
import { PER_PAGE } from '@app/_lib/data/mysql/constants'
import { getBackgrounds as getMySQLBackgrounds } from '@app/_lib/data/mysql/media'
import { convertImageBlockURL } from '@app/_lib/data/mysql/utils'
import { MutationResultType } from '@app/api/graphql/constants'
import { getOption, removeOption } from '../../mysql/option'

const format = (
    image: WithId<ImageBlockType> | ImageBlockType,
): ImageBlockType => ({
    title: image.title,
    mimeType: image.mimeType,
    sizes: image.sizes,
    url: image.url,
    width: image.width,
    height: image.height,
})

/**
 * Get backgrounds
 * This returns the cached result if it exists
 *
 * @returns {Promise<ImageBlockType[]>} - The background array
 */
export const getCachedBackgrounds = async (): Promise<ImageBlockType[]> => {
    const key = getCacheKey(COLLECTION.BACKGROUNDS)

    return await Cached.getInstance().getOrExecute(
        key,
        async () =>
            await Mongo.random<ImageBlockType>(COLLECTION.BACKGROUNDS, 10).then(
                async (backgrounds) => {
                    if (backgrounds.length) {
                        return backgrounds.map((image) => format(image))
                    }
                    const result = await updateBackgrounds()
                    return result.map((image) => format(image))
                },
            ),
        DAY_IN_SECONDS,
        IS_DEV,
    )
}

/**
 * Update backgrounds from MySQL
 *
 * @returns {Promise<ImageBlockType[]>} - The background array
 * @todo update one background
 */
export const updateBackgrounds = async (): Promise<ImageBlockType[]> => {
    Cached.getInstance().flush(getCacheKey(COLLECTION.BACKGROUNDS))
    Logger.server('Calling MySQL getBackgrounds')
    return await getMySQLBackgrounds().then(async (result) => {
        const backgrounds = result.map((image) =>
            convertImageBlockURL(format(image)),
        )
        await Mongo.deleteMany(COLLECTION.BACKGROUNDS, {})
        await Mongo.insertMany(COLLECTION.BACKGROUNDS, backgrounds)
        return backgrounds
    })
}

export const getBackgrounds = async (page: number = 1) =>
    await Mongo.findMany<ImageBlockType>(
        COLLECTION.BACKGROUNDS,
        {},
        { limit: PER_PAGE, skip: PER_PAGE * (page - 1) },
    ).then((result) => result.map((image) => format(image)))

/**
 * Update Mongo Post type from MySQL for GraphQL
 *
 * @param {string} nonce - WP nonce
 * @returns {Promise<MutationResultType>}
 */
export const mutateBackground = async (
    nonce: string,
): Promise<MutationResultType> => {
    // Nonce validation
    Logger.server('GQL Server mutateBackground: started.')
    const optionKey = `update_background_${nonce}`
    const nonceValue = await getOption(optionKey)
    await removeOption(optionKey)

    if (nonce !== nonceValue) {
        const message = 'GQL Server mutateBackground: got invalid nonce.'
        Logger.server(message)
        throw Error(message)
    }

    await updateBackgrounds()

    Logger.server(`GQL Server mutateBackground:  updated.`)

    return {
        result: true,
    }
}
