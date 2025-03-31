import Mongo from '@common/data/mongo/mongo'
import { PER_PAGE } from '@src/constants/mysql-query'
import type { Term } from '@src/types/wordpress'

const getTerm = async (page: number = 1) =>
    await Mongo.findMany<Term>(
        'term',
        {},
        { limit: PER_PAGE, skip: PER_PAGE * (page - 1) },
    )

export default getTerm
