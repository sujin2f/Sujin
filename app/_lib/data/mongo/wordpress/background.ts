/* Models */
import Cached from '@common/model/Cached'
import Mongo from '@common/data/mongo/mongo'
import { ERROR_MESSAGE, ServerError } from '@app/_lib/constants-error'
/* CONSTANTS */
// import { DAY_IN_SECONDS } from '@common/constants/datetime'
import { IS_DEV } from '@common/constants/helper'
import { COLLECTION, POST_TYPE } from '@app/_lib/types'
import { IMAGE_SIZE_BACKGROUND } from '@app/_lib/types'
/* Types */
import type { T_Background } from '@app/_lib/types'
/* Utils */
import { getCacheKey } from '@app/_lib/utils'
import Logger from '@common/model/Logger'
import { PER_PAGE } from '@app/_lib/data/mysql/constants'
import { getBackgrounds as getMySQLBackgrounds } from '@app/_lib/data/mysql/media'
import { convertImageBlockURL } from '@app/_lib/data/mysql/utils'
import { MutationResultType } from '@app/api/graphql/constants'
import { formatImageBlock } from '@app/_lib/data/mongo/wordpress/util'
import { auth } from '@app/_lib/utils-server'

const format = (image: T_Background): T_Background =>
    formatImageBlock(image, IMAGE_SIZE_BACKGROUND)

/**
 * Get backgrounds
 * This returns the cached result if it exists
 *
 * @returns {Promise<T_Background[]>} - The background array
 */
export const getCachedBackgrounds = async (): Promise<T_Background[]> => {
    const key = getCacheKey(COLLECTION.BACKGROUNDS)

    return await Cached.getInstance().getOrExecute(
        key,
        async () =>
            await Mongo.random<T_Background>(COLLECTION.BACKGROUNDS, 10),
        0,
        IS_DEV,
    )
}

/**
 * Update backgrounds from MySQL
 * @returns {Promise<T_Background[]>} - The background array
 * @throws
 */
export const updateBackgrounds = async (
    nonce?: string,
): Promise<T_Background[]> => {
    await auth(POST_TYPE.ATTACHMENT, nonce)

    Cached.getInstance().flush(getCacheKey(COLLECTION.BACKGROUNDS))
    Logger.server('Calling MySQL getBackgrounds')
    const backgrounds = await getMySQLBackgrounds().then(async (result) => {
        const backgrounds = result.map((image) =>
            format(convertImageBlockURL(format(image))),
        )
        await Mongo.deleteMany(COLLECTION.BACKGROUNDS, {}).catch(() => {
            throw new ServerError(
                ERROR_MESSAGE.ATTACHMENT.DELETE_MANY,
                'updateBackgrounds()',
                backgrounds,
            )
        })
        await Mongo.insertMany(COLLECTION.BACKGROUNDS, backgrounds).catch(
            () => {
                throw new ServerError(
                    ERROR_MESSAGE.ATTACHMENT.INSERT_MANY,
                    'updateBackgrounds()',
                    backgrounds,
                )
            },
        )

        return backgrounds.map((image) => format(image))
    })

    await Cached.getInstance().set(
        getCacheKey(COLLECTION.BACKGROUNDS),
        backgrounds,
        0,
    )
    return backgrounds
}

export const getBackgrounds = async (page: number = 1) =>
    await Mongo.findMany<T_Background>(
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
    await updateBackgrounds(nonce)
    return {
        result: true,
    }
}
