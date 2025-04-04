import Mongo from '@common/data/mongo/mongo'
import { COLLECTION } from '@app/helpers/constants/mongo'
import type { OptionType } from '@app/helpers/types/mongo'

/**
 * Set site-wide system options.
 *
 * @param {string} key - The key of the option.
 * @param {string} value - The value of the option.
 */
const setSystemOption = async (key: string, value: string) =>
    await Mongo.findOne<OptionType>(COLLECTION.OPTIONS, { key })
        .then(async () => {
            await Mongo.replaceOne(COLLECTION.OPTIONS, { key }, { key, value })
        })
        .catch(async () => {
            await Mongo.insertOne(COLLECTION.OPTIONS, { key, value })
        })

export default setSystemOption
