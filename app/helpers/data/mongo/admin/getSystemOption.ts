import Mongo from '@common/data/mongo/mongo'
import { COLLECTION } from '@app/helpers/constants/mongo'
import type { OptionType } from '@app/helpers/types/mongo'

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
