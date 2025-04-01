/* Models */
import Cached from '@common/model/Cached'
import Mongo from '@common/data/mongo/mongo'
import Logger from '@common/model/Logger'
/* Utils */
import getOption from '@src/db/mysql/getOption'
import { removeOption } from '@src/db/mysql/removeOption'
import getPostBy from '@src/db/mysql/getPostBy'
/* Types */
import type { MutationResultType } from '@src/constants/graphql'

/**
 * Removes cached data related to a specific post.
 * @param {string} slug - The slug of the post.
 * @param {string} categories - Comma-separated string of categories associated with the post.
 * @param {string} tags - Comma-separated string of tags associated with the post.
 */
const removeCache = async (slug: string) => {
    const keys = [`post-${slug.toLowerCase()}`]

    await Cached.getInstance().flush(...keys)
}

/**
 * Updates a post in the database and clears associated cache.
 * @param {string} nonce - The nonce value used to validate the update request.
 * @param {string} slug - The slug of the post.
 * @param {string} categories - Comma-separated string of categories associated with the post.
 * @param {string} tags - Comma-separated string of tags associated with the post.
 * @returns {Promise<MutationResultType>} An object indicating the result of the operation.
 * @throws {Error} Throws an error if the nonce value is invalid.
 */
const updatePage = async (
    nonce: string,
    slug: string,
): Promise<MutationResultType> => {
    Logger.server('GQL Server updatePage: started.')
    const optionKey = `update_page_${nonce}`
    const nonceValue = await getOption(optionKey)
    await removeOption(optionKey)

    // Nonce validation
    if (`${nonce}-${slug}` !== nonceValue) {
        const message = 'GQL Server updatePage: got invalid nonce.'
        Logger.server(message)
        throw Error(message)
    }

    // Remove Cache and Update Mongo Post
    await removeCache(slug)

    const post = await getPostBy('slug', slug, 'page', false)
    await Mongo.findOne('page', { slug })
        .then(async () => await Mongo.replaceOne('page', { slug }, post))
        .catch(async () => await Mongo.insertOne('page', post))

    Logger.server(`GQL Server updatePage: Updated MongoDB page: ${slug}`)
    return {
        result: true,
    }
}

export default updatePage
