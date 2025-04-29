import type { WithoutId } from 'mongodb'
/* Models */
import Cached from '@common/model/Cached'
/* CONSTANTS */
import { COLLECTION } from '@app/_lib/types'
import { default as schema } from '@app/_lib/schema/10.3.4'
/* T_Types */
import type { T_Background } from '@app/_lib/types'
/* Utils */
import { getCacheKey } from '@app/_lib/utils/cache'
import { getBackgrounds } from '@app/_lib/data/mysql/media'
import { convertImageBlockURL } from '@app/_lib/data/mysql/utils'
import { schemaFormatter } from '@common/utils/object'
import { getCollection } from '@common/data/mongo/mongo'

const format = (image: T_Background): WithoutId<T_Background> =>
    schemaFormatter(image, schema.background) as WithoutId<T_Background>

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
