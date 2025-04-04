import Mongo from '@common/data/mongo/mongo'
import { COLLECTION } from '@src/constants/mongo'
import type { OptionType } from '@src/types/mongo'

/**
 * Get site-wide system options.
 *
 * @param {string} key - The key of the option.
 * @returns {Promise<string>} Value
 */
const getSystemOption = async (key: string): Promise<string> =>
    await Mongo.findOne<OptionType>(COLLECTION.OPTIONS, { key })
        .catch(() => ({ value: '' }))
        .then((result) => result.value)

export default getSystemOption
