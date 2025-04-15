/* Models */
import Cached from '@common/model/Cached'
/* CONSTANTS */
import { IS_DEV } from '@common/constants/helper'
import { COLLECTION, POST_TYPE } from '@app/_lib/types'
import { default as schema } from '@app/_lib/data/mongo/schema/10.3.2'
import { DAY_IN_SECONDS } from '@common/constants/datetime'
/* T_Types */
import type { T_Background } from '@app/_lib/types'
/* Utils */
import { getCacheKey } from '@app/_lib/utils'
import { PER_PAGE } from '@app/_lib/data/mysql/constants'
import { getBackgrounds as getMySQLBackgrounds } from '@app/_lib/data/mysql/media'
import { convertImageBlockURL } from '@app/_lib/data/mysql/utils'
import { MutationResultType } from '@app/api/graphql/constants'
import { auth } from '@app/_lib/utils-server'
import { schemaFormatter } from '@common/utils/object'
import { getCollection } from '@common/data/mongo/mongo'

const format = (image: T_Background): T_Background =>
    schemaFormatter(image, schema.background) as T_Background

/**
 * Get backgrounds
 * This returns the cached result if it exists
 *
 * @returns {Promise<T_Background[]>} - The background array
 */
export const getCachedBackgrounds = async (): Promise<T_Background[]> =>
    await Cached.getInstance().getOrExecute(
        getCacheKey(COLLECTION.BACKGROUNDS),
        async () =>
            await getCollection<T_Background>(COLLECTION.BACKGROUNDS).then(
                async (collection) =>
                    await collection
                        .aggregate<T_Background>([{ $sample: { size: 10 } }])
                        .toArray(),
            ),
        DAY_IN_SECONDS,
        IS_DEV,
    )

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
    const backgrounds = await getMySQLBackgrounds().then(async (result) => {
        const backgrounds = result.map((image) =>
            format(convertImageBlockURL(format(image))),
        )

        await getCollection<T_Background>(COLLECTION.BACKGROUNDS).then(
            async (collection) => {
                await collection.deleteMany({})
                await collection.insertMany(backgrounds)
            },
        )

        return backgrounds
    })
    return backgrounds
}

export const getBackgrounds = async (page: number = 1) =>
    await getCollection<T_Background>(COLLECTION.BACKGROUNDS).then(
        async (collection) =>
            await collection
                .find({})
                .limit(PER_PAGE)
                .skip(PER_PAGE * (page - 1))
                .toArray(),
    )

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
