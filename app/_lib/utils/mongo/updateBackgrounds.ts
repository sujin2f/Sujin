import type { WithoutId } from 'mongodb'
/* Models */
import Cached from '@common/model/Cached'
import { select } from '@common/data/mysql'
import { FetchError } from '@common/model/Error'
/* CONSTANTS */
import { COLLECTION } from '@app/_lib/types'
import { MySQLQuery } from '@app/_lib/utils/mysql/constants'
import { default as schema } from '@app/_lib/schema/10.3.4'
/* T_Types */
import type { T_Background, T_MySQLPost } from '@app/_lib/types'
/* Utils */
import { getCacheKey } from '@app/_lib/utils/cache'
import { convertImageBlockURL } from '@app/_lib/utils/clients'
import { schemaFormatter } from '@common/utils/object'
import { getCollection } from '@common/data/mongo/mongo'
import { getMediaFromPost } from '@app/_lib/utils/mysql/getMediaFromPost'

/**
 * Update backgrounds from MySQL
 * @returns {Promise<T_Background[]>} - The background array
 * @throws
 */
export const updateBackgrounds = async (): Promise<void> => {
    Cached.getInstance().flush(getCacheKey(COLLECTION.BACKGROUNDS))
    await getBackgrounds().then(async (result) => {
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

/**
 * Get backgrounds from MySQL
 * @returns {Promise<T_ImageBlock[]>}
 * @throws
 */
const getBackgrounds = async (): Promise<T_Background[]> => {
    const result = await select<T_MySQLPost>(MySQLQuery.getBackgrounds()).then(
        async (posts) => {
            const result: T_Background[] = []
            for await (const post of posts) {
                result.push(await getMediaFromPost(post))
            }
            return result
        },
    )

    if (!result.length) throw new FetchError('MySQL Background is empty')

    return result
}

const format = (image: T_Background): WithoutId<T_Background> =>
    schemaFormatter(image, schema.background) as WithoutId<T_Background>
