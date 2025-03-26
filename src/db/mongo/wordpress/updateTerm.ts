/* Models */
import { Cached } from '@common/model/Cached'
import Mongo from '@common/data/mongo/mongo'
/* Utils */
import { getOption } from '@src/db/mysql/getOption'
import { removeOption } from '@src/db/mysql/removeOption'
import { getTermById } from '@src/db/mysql/getTermBy'
/* Types */
import type { MutationResultType } from '@src/constants/graphql'
import type { Term } from '@src/types/wordpress'

/**
 * Removes cached data related to a specific term.
 * @param {Term} term - The ID of the term.
 */
const removeCache = async (term: Term) => {
    const key = `archive-${term.type}-${term.slug}`
    await Cached.getInstance().flush([key])
}

/**
 * Updates a term in the database and clears associated cache.
 * @param {string} nonce - The nonce value used to validate the update request.
 * @param {number} termId - The ID of the term.
 * @returns {Promise<MutationResultType>} An object indicating the result of the operation.
 * @throws {Error} Throws an error if the nonce value is invalid.
 */
const updateTerm = async (
    nonce: string,
    termId: number,
): Promise<MutationResultType> => {
    const optionKey = `update_term_${nonce}`
    const option = await getOption(optionKey)
    await removeOption(optionKey)
    const nonceValue = option && option.option_value

    // Nonce validation
    if (`${nonce}-${termId}` !== nonceValue) {
        const message = 'updateTerm got invalid nonce.'
        console.error(message)
        throw Error(message)
    }

    const term = await getTermById(termId)
    // Remove Cache and Update Mongo Term
    await removeCache(term)
    await Mongo.findOne('term', { id: termId })
        .then(async () => await Mongo.replaceOne('term', { id: termId }, term))
        .catch(async () => await Mongo.insertOne('term', term))

    return {
        result: true,
    }
}

export default updateTerm
