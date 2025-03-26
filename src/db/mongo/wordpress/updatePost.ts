/* Models */
import { Cached } from '@common/model/Cached'
import Mongo from '@common/data/mongo/mongo'
/* Utils */
import { getOption } from '@src/db/mysql/getOption'
import { removeOption } from '@src/db/mysql/removeOption'
import getPostBy from '@src/db/mysql/getPostBy'
/* Types */
import type { MutationResultType } from '@src/constants/graphql'

/**
 * Removes cached data related to a specific post.
 * @param {string} slug - The slug of the post.
 * @param {number} id - The ID of the post.
 * @param {string} categories - Comma-separated string of categories associated with the post.
 * @param {string} tags - Comma-separated string of tags associated with the post.
 */
const removeCache = async (
    slug: string,
    id: number,
    categories: string,
    tags: string,
) => {
    const keys = [
        `post-${id}`,
        `post-${slug.toLowerCase()}`,
        ...categories.split(',').map((v) => `archive-category-${v}`),
        ...tags.split(',').map((v) => `archive-post_tag-${v}`),
        'prev-next-',
    ]

    await Cached.getInstance().flush(keys)
}

/**
 * Updates a post in the database and clears associated cache.
 * @param {string} nonce - The nonce value used to validate the update request.
 * @param {string} slug - The slug of the post.
 * @param {number} id - The ID of the post.
 * @param {string} categories - Comma-separated string of categories associated with the post.
 * @param {string} tags - Comma-separated string of tags associated with the post.
 * @returns {Promise<MutationResultType>} An object indicating the result of the operation.
 * @throws {Error} Throws an error if the nonce value is invalid.
 */
const updatePost = async (
    nonce: string,
    slug: string,
    id: number,
    categories: string,
    tags: string,
): Promise<MutationResultType> => {
    const optionKey = `update_post_${nonce}`
    const option = await getOption(optionKey)
    await removeOption(optionKey)
    const nonceValue = option && option.option_value

    // Nonce validation
    if (`${nonce}-${slug}` !== nonceValue) {
        const message = 'updatePost got invalid nonce.'
        console.error(message)
        throw Error(message)
    }

    // Remove Cache and Update Mongo Post
    await removeCache(slug, id, categories, tags)
    const post = await getPostBy('id', id, false)
    await Mongo.findOne('post', { id })
        .then(async () => await Mongo.replaceOne('post', { id }, post))
        .catch(async () => await Mongo.insertOne('post', post))

    return {
        result: true,
    }
}

export default updatePost
