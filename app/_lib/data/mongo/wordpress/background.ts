import type { WithoutId } from 'mongodb'
/* Models */
import Cached from '@common/model/Cached'
/* CONSTANTS */
import { IS_DEV } from '@common/constants/helper'
import { COLLECTION, POST_TYPE } from '@app/_lib/types'
import { default as schema } from '@app/_lib/data/mongo/schema/10.3.4'
import { DAY_IN_SECONDS } from '@common/constants/datetime'
/* T_Types */
import type { T_Background } from '@app/_lib/types'
/* Utils */
import { getCacheKey } from '@app/_lib/utils'
import { getBackgrounds as getMySQLBackgrounds } from '@app/_lib/data/mysql/media'
import { convertImageBlockURL } from '@app/_lib/data/mysql/utils'
import { MutationResultType } from '@app/api/graphql/constants'
import { auth } from '@app/_lib/data/mongo/user'
import { schemaFormatter } from '@common/utils/object'
import { getCollection } from '@common/data/mongo/mongo'
import { getAggregation } from '@app/_lib/utils-server'

const format = (image: T_Background): WithoutId<T_Background> =>
    schemaFormatter(image, schema.background) as WithoutId<T_Background>

/**
 * Get backgrounds
 * This returns the cached result if it exists
 *
 * @returns {Promise<WithoutId<T_Background>[]>} - The background array
 */
export const getCachedBackgrounds = async (): Promise<
    WithoutId<T_Background>[]
> =>
    await Cached.getInstance().getOrExecute(
        getCacheKey(COLLECTION.BACKGROUNDS),
        async () => {
            const collection = await getCollection<T_Background>(
                COLLECTION.BACKGROUNDS,
            )
            return await collection
                .aggregate<T_Background>([{ $sample: { size: 10 } }])
                .project<WithoutId<T_Background>>({ _id: 0 })
                .toArray()
        },
        DAY_IN_SECONDS,
        IS_DEV,
    )

/**
 * Update backgrounds from MySQL
 * @returns {Promise<T_Background[]>} - The background array
 * @throws
 */
export const updateBackgrounds = async (nonce?: string): Promise<void> => {
    await auth(POST_TYPE.ATTACHMENT, nonce)

    Cached.getInstance().flush(getCacheKey(COLLECTION.BACKGROUNDS))
    await getMySQLBackgrounds().then(async (result) => {
        const backgrounds = result.map((image) =>
            convertImageBlockURL(format(image)),
        )
        const collection = await getCollection<WithoutId<T_Background>>(
            COLLECTION.BACKGROUNDS,
        )
        await collection.deleteMany({})
        await collection.insertMany(backgrounds)
    })
}

export const getBackgrounds = async (
    page: number = 1,
): Promise<T_Background[]> => {
    const collection = await getCollection<T_Background>(COLLECTION.BACKGROUNDS)
    return await collection
        .aggregate<T_Background>([
            ...getAggregation('paging', page),
            ...getAggregation('_id'),
        ])
        .toArray()
}

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
