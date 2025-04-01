import Mongo from '@common/data/mongo/mongo'
import { PER_PAGE } from '@src/constants/mysql-query'
import type { Image } from '@src/types/wordpress'

const getBackgrounds = async (page: number = 1) =>
    await Mongo.findMany<Image>(
        'backgrounds',
        {},
        { limit: PER_PAGE, skip: PER_PAGE * (page - 1) },
    )

export default getBackgrounds
