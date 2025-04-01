/* Models */
import Cached from '@common/model/Cached'
import Mongo from '@common/data/mongo/mongo'
import Logger from '@common/model/Logger'
/* Utils */
import getOption from '@src/db/mysql/getOption'
import { removeOption } from '@src/db/mysql/removeOption'
import { getMedia } from '@src/db/mysql/getMedia'
/* Types */
import type { MutationResultType } from '@src/constants/graphql'

/**
 * Updates a post in the database and clears associated cache.
 * @param {string} nonce - The nonce value used to validate the update request.
 * @param {number} id - The slug of the post.
 * @returns {Promise<MutationResultType>} An object indicating the result of the operation.
 * @throws {Error} Throws an error if the nonce value is invalid.
 */
const updateBackground = async (
    nonce: string,
    id: number,
): Promise<MutationResultType> => {
    Logger.server('GQL Server updateBackground: started.')
    const optionKey = `update_background_${nonce}`
    const nonceValue = await getOption(optionKey)
    await removeOption(optionKey)

    // Nonce validation
    if (`${nonce}-${id}` !== nonceValue) {
        const message = 'GQL Server updateBackground: got invalid nonce.'
        Logger.server(message)
        throw Error(message)
    }

    // Remove Cache and Update Mongo Post
    await Cached.getInstance().flush('backgrounds')

    const image = await getMedia(id)
    if (!image) {
        return {
            result: false,
        }
    }
    await Mongo.findOne('backgrounds', { url: image.url })
        .then(
            async () =>
                await Mongo.replaceOne(
                    'backgrounds',
                    { url: image.url },
                    {
                        ...image,
                        id,
                    },
                ),
        )
        .catch(
            async () =>
                await Mongo.insertOne('backgrounds', {
                    ...image,
                    id,
                }),
        )

    Logger.server(
        `GQL Server updateBackground: Updated MongoDB backgrounds: ${id}`,
    )
    return {
        result: true,
    }
}

export default updateBackground
